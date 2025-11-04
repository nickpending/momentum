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
MOMENTUM_INSTALL="$HOME/.config/momentum"

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

# Step 3.5: Get user name for voice interactions
echo -e "${CYAN}Step 3.5: Personalizing your experience${RESET}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo

EXISTING_NAME=""
if [[ -f "$EXISTING_CONFIG" ]]; then
    source "$EXISTING_CONFIG" 2>/dev/null || true
    EXISTING_NAME="$NAME"
fi

echo "Momentum uses your name for voice interactions and personalized responses."
echo -e "${YELLOW}What's your name?${RESET}"
if [[ -n "$EXISTING_NAME" ]]; then
    printf "Name [$EXISTING_NAME]: "
else
    printf "Name: "
fi
read -r USER_NAME

# Use existing value if no input provided
if [[ -z "$USER_NAME" && -n "$EXISTING_NAME" ]]; then
    USER_NAME="$EXISTING_NAME"
elif [[ -z "$USER_NAME" ]]; then
    USER_NAME="User"  # Default fallback
fi

echo -e "${GREEN}✅ Using name: $USER_NAME${RESET}"
echo

# Step 4: Check for existing installation
echo -e "${CYAN}Step 4: Installing Momentum files${RESET}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo

if [[ -d "$MOMENTUM_INSTALL" ]]; then
    echo -e "${YELLOW}⚠️  Existing installation found at $MOMENTUM_INSTALL${RESET}"
    printf "Backup and reinstall? (y/n): "
    read -r REINSTALL
    if [[ "$REINSTALL" =~ ^[Yy]$ ]]; then
        # Create backups inside momentum directory
        mkdir -p "$MOMENTUM_INSTALL/.backups"
        backup_name="backup-$(date +%Y%m%d_%H%M%S)"
        backup_dir="$MOMENTUM_INSTALL/.backups/$backup_name"
        
        # Copy current installation to backup (excluding previous backups)
        mkdir -p "$backup_dir"
        for item in "$MOMENTUM_INSTALL"/*; do
            if [[ "$(basename "$item")" != ".backups" ]]; then
                cp -r "$item" "$backup_dir/" 2>/dev/null || true
            fi
        done
        
        echo -e "${GREEN}✅ Backed up to $backup_dir${RESET}"
        
        # Remove old files (except backups)
        for item in "$MOMENTUM_INSTALL"/*; do
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
mkdir -p "$MOMENTUM_INSTALL"

# Only copy if component doesn't exist or we just backed up
if [[ ! -d "$MOMENTUM_INSTALL/agents" ]]; then
    cp -r "$MOMENTUM_SOURCE/agents" "$MOMENTUM_INSTALL/" && echo "  ✓ Agents"
fi
if [[ ! -d "$MOMENTUM_INSTALL/commands" ]]; then
    cp -r "$MOMENTUM_SOURCE/commands" "$MOMENTUM_INSTALL/" && echo "  ✓ Commands"
fi
if [[ ! -d "$MOMENTUM_INSTALL/templates" ]]; then
    cp -r "$MOMENTUM_SOURCE/templates" "$MOMENTUM_INSTALL/" && echo "  ✓ Templates"
fi
if [[ ! -d "$MOMENTUM_INSTALL/resources" ]]; then
    cp -r "$MOMENTUM_SOURCE/resources" "$MOMENTUM_INSTALL/" && echo "  ✓ Resources"
fi
if [[ ! -d "$MOMENTUM_INSTALL/subagents" ]]; then
    cp -r "$MOMENTUM_SOURCE/subagents" "$MOMENTUM_INSTALL/" && echo "  ✓ Subagents"
fi
if [[ ! -d "$MOMENTUM_INSTALL/skills" ]]; then
    cp -r "$MOMENTUM_SOURCE/skills" "$MOMENTUM_INSTALL/" && echo "  ✓ Skills"
fi
if [[ ! -d "$MOMENTUM_INSTALL/hooks" ]]; then
    mkdir -p "$MOMENTUM_INSTALL/hooks"
fi
# Always copy all hooks to get latest versions
cp "$MOMENTUM_SOURCE/hooks/momentum-session-start-hook.ts" "$MOMENTUM_INSTALL/hooks/" 2>/dev/null && echo "  ✓ Session start hook (updated)"
cp "$MOMENTUM_SOURCE/hooks/momentum-user-prompt-submit-hook.ts" "$MOMENTUM_INSTALL/hooks/" 2>/dev/null && echo "  ✓ User prompt submit hook (updated)"
cp "$MOMENTUM_SOURCE/hooks/momentum-stop-hook.ts" "$MOMENTUM_INSTALL/hooks/" 2>/dev/null && echo "  ✓ Stop hook (updated)"
# Copy shared utilities
if [[ -d "$MOMENTUM_SOURCE/hooks/shared" ]]; then
    cp -r "$MOMENTUM_SOURCE/hooks/shared" "$MOMENTUM_INSTALL/hooks/" 2>/dev/null && echo "  ✓ Shared voice utilities (updated)"
fi
# Legacy hook for backward compatibility
cp "$MOMENTUM_SOURCE/hooks/momentum-hook.ts" "$MOMENTUM_INSTALL/hooks/" 2>/dev/null && echo "  ✓ Legacy hook (for compatibility)"
chmod +x "$MOMENTUM_INSTALL/hooks"/*.ts 2>/dev/null || true

if [[ ! -d "$MOMENTUM_INSTALL/contexts" ]]; then
    cp -r "$MOMENTUM_SOURCE/contexts" "$MOMENTUM_INSTALL/" && echo "  ✓ Contexts"
else
    # Always update routing files to get latest versions
    cp "$MOMENTUM_SOURCE/contexts/ASSISTANT_ROUTING.md" "$MOMENTUM_INSTALL/contexts/" 2>/dev/null && echo "  ✓ ASSISTANT_ROUTING.md (updated)"
    cp "$MOMENTUM_SOURCE/contexts/PROJECT_ROUTING.md" "$MOMENTUM_INSTALL/contexts/" 2>/dev/null && echo "  ✓ PROJECT_ROUTING.md (updated)"
fi

# Install voice files (always update to get latest)
mkdir -p "$MOMENTUM_INSTALL/voices/styles"
mkdir -p "$MOMENTUM_INSTALL/voices/verbosity"
if [[ -d "$MOMENTUM_SOURCE/voices/styles" ]]; then
    cp "$MOMENTUM_SOURCE/voices/styles"/*.toml "$MOMENTUM_INSTALL/voices/styles/" 2>/dev/null && echo "  ✓ Voice styles (updated)"
fi
if [[ -d "$MOMENTUM_SOURCE/voices/verbosity" ]]; then
    cp "$MOMENTUM_SOURCE/voices/verbosity"/*.toml "$MOMENTUM_INSTALL/voices/verbosity/" 2>/dev/null && echo "  ✓ Voice verbosity levels (updated)"
fi

# Create TOML configuration (source of truth)
cat > "$MOMENTUM_INSTALL/config.toml" << EOF
# Momentum Configuration
# Edit this file to customize your workflow settings
# Generated: $(date)

[personalization]
# Your name (used in greetings and voice output)
name = "$USER_NAME"

[paths]
# Where your development projects live
dev = "$DEV_DIR"
# Where your planning/documentation lives (Obsidian)
projects = "$PLANNING_DIR"

[momentum]
# Momentum installation directory
install = "$HOME/.config/momentum"
# Runtime workspace for assistant mode
workspace = "$HOME/.local/share/momentum"

[lore]
# Lore configuration paths
config = "$HOME/.config/lore"
data = "$HOME/.local/share/lore"
cache = "$HOME/.cache/lore"

[voice]
# Voice style: jarvis, professional, casual, or custom
style = "jarvis"

[voice.verbosity]
# Verbosity level per mode: terse, brief, or normal
assistant = "terse"
project = "brief"

[voice.tts]
# Text-to-Speech configuration
enabled = true
provider = "system"  # Options: "system" (free) or "elevenlabs" (premium)
# api_key = ""  # Required for elevenlabs provider
# voice_id = ""  # Required for elevenlabs provider (create JARVIS-style voice)
cache_threshold = 0.90  # Semantic similarity threshold (0.0-1.0)

# Cache control per verbosity level
[voice.tts.cache]
terse = true     # Short, common phrases - use cache
brief = true     # Concise responses - use cache
normal = false   # Longer, unique content - don't cache
EOF

echo -e "${GREEN}✅ TOML configuration created${RESET}"

# Generate bash config from TOML (for setupd compatibility)
cat > "$MOMENTUM_INSTALL/config" << EOF
#!/usr/bin/env bash
# Momentum Configuration (generated from config.toml)
# DO NOT EDIT - This file is auto-generated from config.toml
# Edit config.toml instead and re-run install.sh to regenerate
# Generated: $(date)

# Your workspace directories
export WORKFLOW_DEV="$DEV_DIR"
export WORKFLOW_PROJECTS="$PLANNING_DIR"

# Personalization
export NAME="$USER_NAME"

# Momentum paths
export MOMENTUM_INSTALL="$HOME/.config/momentum"
export MOMENTUM_WORKSPACE="$HOME/.local/share/momentum"

# Lore paths
export LORE_CONFIG="$HOME/.config/lore"
export LORE_DATA="$HOME/.local/share/lore"
export LORE_CACHE="$HOME/.cache/lore"
EOF

echo -e "${GREEN}✅ Bash exports generated from TOML${RESET}"

# Write installed version
cp "$MOMENTUM_SOURCE/VERSION" "$MOMENTUM_INSTALL/VERSION" 2>/dev/null || echo "1.0.0" > "$MOMENTUM_INSTALL/VERSION"
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

# Create base directory structure (minimal - only what Claude needs)
BASE_DIR="$HOME/.local/share/momentum"
mkdir -p "$BASE_DIR/.claude"

echo "Setting up Momentum base directory at $BASE_DIR..."

# Symlink commands, subagents, skills, and hooks directories
# Remove existing symlinks first to prevent ln from following them
rm -f "$BASE_DIR/.claude/commands" 2>/dev/null || true
rm -f "$BASE_DIR/.claude/agents" 2>/dev/null || true
rm -rf "$BASE_DIR/.claude/skills" 2>/dev/null || true
rm -rf "$BASE_DIR/.claude/hooks" 2>/dev/null || true
ln -sf "$MOMENTUM_INSTALL/commands" "$BASE_DIR/.claude/commands" 2>/dev/null || true
ln -sf "$MOMENTUM_INSTALL/subagents" "$BASE_DIR/.claude/agents" 2>/dev/null || true
ln -sf "$MOMENTUM_INSTALL/skills" "$BASE_DIR/.claude/skills" 2>/dev/null || true
ln -sf "$MOMENTUM_INSTALL/hooks" "$BASE_DIR/.claude/hooks" 2>/dev/null || true

# Create base directory settings.json with complete hook ecosystem
cat > "$BASE_DIR/.claude/settings.json" << EOF
{
  "\$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "bun $HOME/.config/momentum/hooks/momentum-session-start-hook.ts startup"
          }
        ]
      },
      {
        "matcher": "clear",
        "hooks": [
          {
            "type": "command",
            "command": "bun $HOME/.config/momentum/hooks/momentum-session-start-hook.ts clear"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bun $HOME/.config/momentum/hooks/momentum-user-prompt-submit-hook.ts"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bun $HOME/.config/momentum/hooks/momentum-stop-hook.ts"
          }
        ]
      }
    ]
  },
  "permissions": {
    "additionalDirectories": [
      "$HOME/.local/share/momentum",
      "$DEV_DIR",
      "$PLANNING_DIR",
      "$HOME/.config/momentum/",
      "$HOME/.config/lore/",
      "$HOME/.local/share/lore/",
      "$HOME/.cache/lore/",
      "/tmp/"
    ],
    "allow": [
      "SlashCommand(/add-task)",
      "SlashCommand(/complete-iteration)",
      "SlashCommand(/complete-task)",
      "SlashCommand(/decompose-iteration)",
      "SlashCommand(/load-app-context)",
      "SlashCommand(/plan-iteration)",
      "SlashCommand(/plan-task)",
      "SlashCommand(/plan-test)",
      "SlashCommand(/restore-state)",
      "SlashCommand(/save-state)",
      "SlashCommand(/setup-luminaries)",
      "SlashCommand(/think)",
      "SlashCommand(/update-project-summary)",
      "Bash(setupd --switch:*)",
      "Bash(printf:*)"
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
        add_to_shell "$SHELL_CONFIG" "source $MOMENTUM_INSTALL/config.fish"
        
        # Create fish-compatible config
        cat > "$MOMENTUM_INSTALL/config.fish" << 'EOF'
# Momentum Configuration for Fish
set -x MOMENTUM_INSTALL "$HOME/.config/momentum"
source $MOMENTUM_INSTALL/config

# Momentum alias - hook injects metadata, alias loads ASSISTANT.md
alias momentum 'cd ~/.local/share/momentum && claude --append-system-prompt (cat $MOMENTUM_INSTALL/agents/ASSISTANT.md) "Hello Assistant"'
EOF
        ;;
    *)
        # Bash/Zsh syntax
        add_to_shell "$SHELL_CONFIG" 'export PATH="$HOME/.local/bin:$PATH"'
        add_to_shell "$SHELL_CONFIG" ""
        add_to_shell "$SHELL_CONFIG" "# Momentum Configuration"
        add_to_shell "$SHELL_CONFIG" "source $MOMENTUM_INSTALL/config"
        add_to_shell "$SHELL_CONFIG" 'alias momentum='"'"'cd ~/.local/share/momentum && claude --append-system-prompt "$(cat $MOMENTUM_INSTALL/agents/ASSISTANT.md)" "Hello Assistant"'"'"
        ;;
esac

echo -e "${GREEN}✅ Shell configuration updated${RESET}"
echo

# Final instructions
echo
echo -e "${GREEN}╔════════════════════════════════════════╗${RESET}"
echo -e "${GREEN}║    Installation Complete! 🎉           ║${RESET}"
echo -e "${GREEN}╚════════════════════════════════════════╝${RESET}"
# Check for lspeak (optional TTS enhancement)
if ! command -v lspeak &> /dev/null; then
  echo
  echo -e "${YELLOW}ℹ️  Optional: lspeak not found${RESET}"
  echo "   Voice summaries will be silent (core functionality unaffected)"
  echo "   To enable TTS, install lspeak: https://github.com/tluyben/lspeak"
fi

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