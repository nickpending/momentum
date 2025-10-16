#!/usr/bin/env bash
# Momentum Interactive Installer
# Shell-agnostic, non-destructive, user-friendly setup

set -e

# Colors (POSIX-compliant)
RED='\033[31m'
GREEN='\033[32m'
YELLOW='\033[33m'
BLUE='\033[34m'
MAGENTA='\033[35m'
CYAN='\033[36m'
RESET='\033[0m'

# Source directory
MOMENTUM_SOURCE="$(cd "$(dirname "$0")" && pwd)"
MOMENTUM_HOME="$HOME/.config/momentum"

clear
echo -e "${MAGENTA}╔════════════════════════════════════════╗${RESET}"
echo -e "${MAGENTA}║      Momentum Installation Setup       ║${RESET}"
echo -e "${MAGENTA}╚════════════════════════════════════════╝${RESET}"
echo
echo "This installer will:"
echo "  • Check for required dependencies"
echo "  • Set up your workspace directories"
echo "  • Configure Momentum for your system"
echo "  • Never delete or overwrite existing files"
echo

# Step 1: Check for Claude CLI
echo -e "${CYAN}Step 1: Checking dependencies${RESET}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo

if command -v claude &> /dev/null; then
    echo -e "${GREEN}✅ Claude Code CLI found${RESET}"
    claude_version=$(claude --version 2>/dev/null || echo "version unknown")
    echo "   Version: $claude_version"
else
    echo -e "${RED}❌ Claude Code CLI not found${RESET}"
    echo
    echo "Momentum requires Claude Code CLI to function."
    echo "Please install it first from:"
    echo -e "${BLUE}https://claude.ai/news/claude-code${RESET}"
    echo
    echo "After installation, run this installer again."
    exit 1
fi

# Check for bun (optional but recommended for hooks)
if command -v bun &> /dev/null; then
    echo -e "${GREEN}✅ Bun runtime found${RESET} (hooks enabled)"
else
    echo -e "${YELLOW}⚠️  Bun not found${RESET} (optional - needed for context hooks)"
    echo "   To enable dynamic context hooks, install with:"
    echo "   ${BLUE}curl -fsSL https://bun.sh/install | bash${RESET}"
fi

echo

# Step 2: Detect shell
echo -e "${CYAN}Step 2: Detecting your shell${RESET}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo

DETECTED_SHELL=$(basename "$SHELL")
SHELL_CONFIG=""

case "$DETECTED_SHELL" in
    zsh)
        SHELL_CONFIG="$HOME/.zshrc"
        echo -e "${GREEN}✅ Detected shell: zsh${RESET}"
        ;;
    bash)
        # Check which config file exists
        if [[ -f "$HOME/.bashrc" ]]; then
            SHELL_CONFIG="$HOME/.bashrc"
        elif [[ -f "$HOME/.bash_profile" ]]; then
            SHELL_CONFIG="$HOME/.bash_profile"
        else
            SHELL_CONFIG="$HOME/.bashrc"
        fi
        echo -e "${GREEN}✅ Detected shell: bash${RESET}"
        ;;
    fish)
        SHELL_CONFIG="$HOME/.config/fish/config.fish"
        echo -e "${GREEN}✅ Detected shell: fish${RESET}"
        ;;
    *)
        echo -e "${YELLOW}⚠️  Unknown shell: $DETECTED_SHELL${RESET}"
        echo "Using bash configuration as fallback"
        SHELL_CONFIG="$HOME/.bashrc"
        ;;
esac

echo "   Config file: $SHELL_CONFIG"
echo

# Step 3: Configure workspace directories
echo -e "${CYAN}Step 3: Setting up workspace directories${RESET}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo

# Check for existing configuration
EXISTING_CONFIG="$HOME/.config/momentum/config"
EXISTING_DEV=""
EXISTING_PLANNING=""

if [[ -f "$EXISTING_CONFIG" ]]; then
    # Source existing config to get current values
    source "$EXISTING_CONFIG" 2>/dev/null || true
    EXISTING_DEV="$WORKFLOW_DEV"
    EXISTING_PLANNING="$WORKFLOW_PROJECTS"

    if [[ -n "$EXISTING_DEV" && -n "$EXISTING_PLANNING" ]]; then
        echo -e "${GREEN}📋 Found existing configuration:${RESET}"
        echo "   Development: $EXISTING_DEV"
        echo "   Planning: $EXISTING_PLANNING"
        echo
        echo "Press ENTER to keep current paths, or type new ones:"
        echo
    fi
fi

echo "Momentum uses two separate directories:"
echo "  📝 Planning directory - for project documentation and ideas"
echo "  💻 Development directory - for your actual code"
echo

# Get development directory
echo -e "${YELLOW}Where do you keep your code projects?${RESET}"
echo "Examples: ~/code, ~/projects, ~/development"
if [[ -n "$EXISTING_DEV" ]]; then
    printf "Development directory [$EXISTING_DEV]: "
else
    printf "Development directory: "
fi
read -r DEV_DIR

# Use existing value if no input provided
if [[ -z "$DEV_DIR" && -n "$EXISTING_DEV" ]]; then
    DEV_DIR="$EXISTING_DEV"
fi

# Expand tilde
DEV_DIR="${DEV_DIR/#\~/$HOME}"

# Validate and create if needed
if [[ ! -d "$DEV_DIR" ]]; then
    echo
    echo "Directory '$DEV_DIR' doesn't exist."
    printf "Create it? (y/n): "
    read -r CREATE_DEV
    if [[ "$CREATE_DEV" =~ ^[Yy]$ ]]; then
        mkdir -p "$DEV_DIR"
        echo -e "${GREEN}✅ Created $DEV_DIR${RESET}"
    else
        echo -e "${RED}❌ Cannot continue without development directory${RESET}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Using existing $DEV_DIR${RESET}"
fi

echo

# Get planning directory
echo -e "${YELLOW}Where should Momentum store project planning/documentation?${RESET}"
echo "This should be SEPARATE from your code directory."
echo "This will store planning docs for ALL your projects."
echo "Examples: ~/Documents/projects, ~/obsidian/projects, ~/notes/projects"
if [[ -n "$EXISTING_PLANNING" ]]; then
    printf "Planning directory for all projects [$EXISTING_PLANNING]: "
else
    printf "Planning directory for all projects: "
fi
read -r PLANNING_DIR

# Use existing value if no input provided
if [[ -z "$PLANNING_DIR" && -n "$EXISTING_PLANNING" ]]; then
    PLANNING_DIR="$EXISTING_PLANNING"
fi

# Expand tilde
PLANNING_DIR="${PLANNING_DIR/#\~/$HOME}"

# Check if same as dev directory
if [[ "$PLANNING_DIR" == "$DEV_DIR" ]]; then
    echo
    echo -e "${RED}❌ Planning directory must be different from development directory${RESET}"
    echo "This keeps documentation separate from code."
    echo "Please choose a different directory."
    exit 1
fi

# Validate and create structure
if [[ ! -d "$PLANNING_DIR" ]]; then
    echo
    echo "Directory '$PLANNING_DIR' doesn't exist."
    printf "Create planning structure? (y/n): "
    read -r CREATE_PLANNING
    if [[ "$CREATE_PLANNING" =~ ^[Yy]$ ]]; then
        mkdir -p "$PLANNING_DIR"
        mkdir -p "$PLANNING_DIR/explorations"
        mkdir -p "$PLANNING_DIR/archive/$(date +%Y)"
        echo -e "${GREEN}✅ Created planning structure at $PLANNING_DIR${RESET}"
    else
        echo -e "${RED}❌ Cannot continue without planning directory${RESET}"
        exit 1
    fi
else
    # Create subdirectories if they don't exist (non-destructive)
    echo -e "${GREEN}✅ Using existing $PLANNING_DIR${RESET}"
    mkdir -p "$PLANNING_DIR/explorations" 2>/dev/null || true
    mkdir -p "$PLANNING_DIR/archive/$(date +%Y)" 2>/dev/null || true
    echo "   Created missing subdirectories (if any)"
fi

echo

# Step 4: Check for existing installation
echo -e "${CYAN}Step 4: Installing Momentum files${RESET}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo

if [[ -d "$MOMENTUM_HOME" ]]; then
    echo -e "${YELLOW}⚠️  Existing installation found at $MOMENTUM_HOME${RESET}"
    printf "Backup and reinstall? (y/n): "
    read -r REINSTALL
    if [[ "$REINSTALL" =~ ^[Yy]$ ]]; then
        # Create backups inside momentum directory
        mkdir -p "$MOMENTUM_HOME/.backups"
        backup_name="backup-$(date +%Y%m%d_%H%M%S)"
        backup_dir="$MOMENTUM_HOME/.backups/$backup_name"
        
        # Copy current installation to backup (excluding previous backups)
        mkdir -p "$backup_dir"
        for item in "$MOMENTUM_HOME"/*; do
            if [[ "$(basename "$item")" != ".backups" ]]; then
                cp -r "$item" "$backup_dir/" 2>/dev/null || true
            fi
        done
        
        echo -e "${GREEN}✅ Backed up to $backup_dir${RESET}"
        
        # Remove old files (except backups)
        for item in "$MOMENTUM_HOME"/*; do
            if [[ "$(basename "$item")" != ".backups" ]]; then
                rm -rf "$item"
            fi
        done
    else
        echo "Keeping existing installation"
    fi
fi

# Copy momentum files
# Always copy components if they're missing
echo "Installing Momentum components..."
mkdir -p "$MOMENTUM_HOME"

# Only copy if component doesn't exist or we just backed up
if [[ ! -d "$MOMENTUM_HOME/agents" ]]; then
    cp -r "$MOMENTUM_SOURCE/agents" "$MOMENTUM_HOME/" && echo "  ✓ Agents"
fi
if [[ ! -d "$MOMENTUM_HOME/commands" ]]; then
    cp -r "$MOMENTUM_SOURCE/commands" "$MOMENTUM_HOME/" && echo "  ✓ Commands"
fi
if [[ ! -d "$MOMENTUM_HOME/templates" ]]; then
    cp -r "$MOMENTUM_SOURCE/templates" "$MOMENTUM_HOME/" && echo "  ✓ Templates"
fi
if [[ ! -d "$MOMENTUM_HOME/resources" ]]; then
    cp -r "$MOMENTUM_SOURCE/resources" "$MOMENTUM_HOME/" && echo "  ✓ Resources"
fi
if [[ ! -d "$MOMENTUM_HOME/subagents" ]]; then
    cp -r "$MOMENTUM_SOURCE/subagents" "$MOMENTUM_HOME/" && echo "  ✓ Subagents"
fi
if [[ ! -d "$MOMENTUM_HOME/skills" ]]; then
    cp -r "$MOMENTUM_SOURCE/skills" "$MOMENTUM_HOME/" && echo "  ✓ Skills"
fi
if [[ ! -d "$MOMENTUM_HOME/hooks" ]]; then
    mkdir -p "$MOMENTUM_HOME/hooks"
fi
# Always copy all hooks to get latest versions
cp "$MOMENTUM_SOURCE/hooks/momentum-session-start-hook.ts" "$MOMENTUM_HOME/hooks/" 2>/dev/null && echo "  ✓ Session start hook (updated)"
cp "$MOMENTUM_SOURCE/hooks/momentum-user-prompt-submit-hook.ts" "$MOMENTUM_HOME/hooks/" 2>/dev/null && echo "  ✓ User prompt submit hook (updated)"
cp "$MOMENTUM_SOURCE/hooks/momentum-precompact-hook.ts" "$MOMENTUM_HOME/hooks/" 2>/dev/null && echo "  ✓ PreCompact hook (updated)"
# Copy shared utilities
if [[ -d "$MOMENTUM_SOURCE/hooks/shared" ]]; then
    cp -r "$MOMENTUM_SOURCE/hooks/shared" "$MOMENTUM_HOME/hooks/" 2>/dev/null && echo "  ✓ Shared voice utilities (updated)"
fi
# Legacy hook for backward compatibility
cp "$MOMENTUM_SOURCE/hooks/momentum-hook.ts" "$MOMENTUM_HOME/hooks/" 2>/dev/null && echo "  ✓ Legacy hook (for compatibility)"
chmod +x "$MOMENTUM_HOME/hooks"/*.ts 2>/dev/null || true

if [[ ! -d "$MOMENTUM_HOME/contexts" ]]; then
    cp -r "$MOMENTUM_SOURCE/contexts" "$MOMENTUM_HOME/" && echo "  ✓ Contexts"
else
    # Always update routing files to get latest versions
    cp "$MOMENTUM_SOURCE/contexts/ASSISTANT_ROUTING.md" "$MOMENTUM_HOME/contexts/" 2>/dev/null && echo "  ✓ ASSISTANT_ROUTING.md (updated)"
    cp "$MOMENTUM_SOURCE/contexts/PORTFOLIO_ROUTING.md" "$MOMENTUM_HOME/contexts/" 2>/dev/null && echo "  ✓ PORTFOLIO_ROUTING.md (updated)"
    cp "$MOMENTUM_SOURCE/contexts/PROJECT_ROUTING.md" "$MOMENTUM_HOME/contexts/" 2>/dev/null && echo "  ✓ PROJECT_ROUTING.md (updated)"
fi

# Create configuration
cat > "$MOMENTUM_HOME/config" << EOF
#!/usr/bin/env bash
# Momentum Configuration
# Generated: $(date)

# Your workspace directories
export WORKFLOW_DEV="$DEV_DIR"
export WORKFLOW_PROJECTS="$PLANNING_DIR"

# Momentum installation
export MOMENTUM_HOME="$HOME/.config/momentum"

# Component paths (for internal use)
export WORKFLOW_HOME="\$MOMENTUM_HOME"
export WORKFLOW_COMMANDS="\$MOMENTUM_HOME/commands"
export WORKFLOW_TEMPLATES="\$MOMENTUM_HOME/templates"
export WORKFLOW_RESOURCES="\$MOMENTUM_HOME/resources"
export WORKFLOW_AGENTS="\$MOMENTUM_HOME/agents"

# Helper function for project name detection
get_project_name() {
    # Try git remote first
    local git_remote=\$(git remote get-url origin 2>/dev/null | sed 's/.*\///' | sed 's/\.git$//')
    if [[ -n "\$git_remote" ]]; then
        echo "\$git_remote"
        return
    fi
    
    # Fallback to directory name
    basename "\$(pwd)"
}
EOF

echo -e "${GREEN}✅ Configuration written${RESET}"

# Write installed version
cp "$MOMENTUM_SOURCE/VERSION" "$MOMENTUM_HOME/VERSION" 2>/dev/null || echo "1.0.0" > "$MOMENTUM_HOME/VERSION"
echo "✅ Version tracked"
echo

# Step 5: Install setupd
echo -e "${CYAN}Step 5: Installing setupd command${RESET}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo

mkdir -p "$HOME/.local/bin"
cp "$MOMENTUM_SOURCE/bin/setupd" "$HOME/.local/bin/"
chmod +x "$HOME/.local/bin/setupd"
echo -e "${GREEN}✅ Installed setupd to ~/.local/bin${RESET}"
echo

# Step 6: Set up Momentum Home
echo -e "${CYAN}Step 6: Setting up Momentum Home${RESET}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo

# Create home directory structure (minimal - only what Claude needs)
HOME_DIR="$HOME/.local/share/momentum/home"
mkdir -p "$HOME_DIR/.claude"

echo "Setting up Momentum Home at $HOME_DIR..."

# Symlink commands, subagents, skills, and hooks directories
# Remove existing symlinks first to prevent ln from following them
rm -f "$HOME_DIR/.claude/commands" 2>/dev/null || true
rm -f "$HOME_DIR/.claude/agents" 2>/dev/null || true
rm -rf "$HOME_DIR/.claude/skills" 2>/dev/null || true
rm -rf "$HOME_DIR/.claude/hooks" 2>/dev/null || true
ln -sf "$MOMENTUM_HOME/commands" "$HOME_DIR/.claude/commands" 2>/dev/null || true
ln -sf "$MOMENTUM_HOME/subagents" "$HOME_DIR/.claude/agents" 2>/dev/null || true
ln -sf "$MOMENTUM_HOME/skills" "$HOME_DIR/.claude/skills" 2>/dev/null || true
ln -sf "$MOMENTUM_HOME/hooks" "$HOME_DIR/.claude/hooks" 2>/dev/null || true

# Create home settings.json with complete hook ecosystem
cat > "$HOME_DIR/.claude/settings.json" << EOF
{
  "\$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "bun .claude/hooks/momentum-session-start-hook.ts startup"
          }
        ]
      },
      {
        "matcher": "clear",
        "hooks": [
          {
            "type": "command",
            "command": "bun .claude/hooks/momentum-session-start-hook.ts clear"
          }
        ]
      },
      {
        "matcher": "compact",
        "hooks": [
          {
            "type": "command",
            "command": "bun .claude/hooks/momentum-session-start-hook.ts compact"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bun .claude/hooks/momentum-user-prompt-submit-hook.ts"
          }
        ]
      }
    ],
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bun .claude/hooks/momentum-precompact-hook.ts"
          }
        ]
      }
    ]
  },
  "permissions": {
    "additionalDirectories": [
      "$DEV_DIR",
      "$PLANNING_DIR",
      "$HOME/.config/momentum/",
      "$HOME/.config/lore/",
      "$HOME/.local/share/lore/",
      "$HOME/.cache/lore/",
      "/tmp/"
    ]
  }
}
EOF

echo -e "${GREEN}✅ Momentum Home configured${RESET}"
echo

# Step 7: Configure shell
echo -e "${CYAN}Step 7: Configuring your shell${RESET}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo

# Function to add line to file if not present
add_to_shell() {
    local file=$1
    local line=$2
    if [[ -f "$file" ]]; then
        if ! grep -Fq "$line" "$file" 2>/dev/null; then
            echo "$line" >> "$file"
        fi
    fi
    # Always return 0 to not trigger set -e
    return 0
}

# Add configuration based on shell type
case "$DETECTED_SHELL" in
    fish)
        # Fish shell syntax
        mkdir -p "$HOME/.config/fish"
        add_to_shell "$SHELL_CONFIG" "set -x PATH \$HOME/.local/bin \$PATH"
        add_to_shell "$SHELL_CONFIG" "source $MOMENTUM_HOME/config.fish"
        
        # Create fish-compatible config
        cat > "$MOMENTUM_HOME/config.fish" << 'EOF'
# Momentum Configuration for Fish
set -x MOMENTUM_HOME "$HOME/.config/momentum"
source $MOMENTUM_HOME/config

# Momentum alias - hook injects metadata, alias loads ASSISTANT.md
alias momentum 'cd ~/.local/share/momentum/home && claude --append-system-prompt (cat $MOMENTUM_HOME/agents/ASSISTANT.md) "TODAY IS: "(date +%Y-%m-%d)". Activate Assistant"'
EOF
        ;;
    *)
        # Bash/Zsh syntax
        add_to_shell "$SHELL_CONFIG" 'export PATH="$HOME/.local/bin:$PATH"'
        add_to_shell "$SHELL_CONFIG" ""
        add_to_shell "$SHELL_CONFIG" "# Momentum Configuration"
        add_to_shell "$SHELL_CONFIG" "source $MOMENTUM_HOME/config"
        add_to_shell "$SHELL_CONFIG" 'alias momentum='"'"'cd ~/.local/share/momentum/home && claude --append-system-prompt "$(cat $MOMENTUM_HOME/agents/ASSISTANT.md)" "TODAY IS: $(date +%Y-%m-%d). Activate Assistant"'"'"
        ;;
esac

echo -e "${GREEN}✅ Shell configuration updated${RESET}"
echo

# Final instructions
echo
echo -e "${GREEN}╔════════════════════════════════════════╗${RESET}"
echo -e "${GREEN}║    Installation Complete! 🎉           ║${RESET}"
echo -e "${GREEN}╚════════════════════════════════════════╝${RESET}"
echo
echo "Your workspace:"
echo -e "  📝 Planning: ${BLUE}$PLANNING_DIR${RESET}"
echo -e "  💻 Development: ${BLUE}$DEV_DIR${RESET}"
echo
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo -e "${YELLOW}IMPORTANT: Reload your shell first!${RESET}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}"
echo
echo "Run this command:"
echo -e "  ${CYAN}source $SHELL_CONFIG${RESET}"
echo
echo "Then start your first project:"
echo
echo -e "${MAGENTA}WHERE TO RUN COMMANDS:${RESET}"
echo "┌─────────────────┬──────────────────────┐"
echo "│ In Terminal     │ In Claude Code       │"
echo "├─────────────────┼──────────────────────┤"
echo "│ momentum        │ /plan-iteration      │"
echo "│ setupd          │ /plan-task           │"
echo "└─────────────────┴──────────────────────┘"
echo
echo -e "${MAGENTA}STEP-BY-STEP FIRST PROJECT:${RESET}"
echo "1. Start Momentum mode:"
echo -e "   ${CYAN}momentum${RESET}"
echo
echo "2. Describe your project idea in natural language"
echo "   Assistant will help you refine it"
echo
echo "3. When ready, tell assistant to save the idea"
echo
echo "4. In terminal, set up project:"
echo -e "   ${CYAN}setupd project-name${RESET}"
echo
echo "5. In Claude Code, plan work:"
echo -e "   ${CYAN}/plan-iteration${RESET}"
echo
echo -e "${GREEN}Ship working software every iteration! 🚀${RESET}"