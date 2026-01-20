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

# Get Obsidian vault root (derive from planning directory parent as default)
EXISTING_OBSIDIAN=""
if [[ -f "$EXISTING_CONFIG" ]]; then
    source "$EXISTING_CONFIG" 2>/dev/null || true
    EXISTING_OBSIDIAN="$OBSIDIAN_DIR"
fi

# Derive default from planning directory parent
DERIVED_OBSIDIAN="$(dirname "$PLANNING_DIR")"

echo -e "${YELLOW}Where is your Obsidian vault root?${RESET}"
echo "This is typically the parent of your planning directory."
if [[ -n "$EXISTING_OBSIDIAN" ]]; then
    printf "Obsidian vault [$EXISTING_OBSIDIAN]: "
else
    printf "Obsidian vault [$DERIVED_OBSIDIAN]: "
fi
read -r OBSIDIAN_DIR

# Use derived/existing value if no input provided
if [[ -z "$OBSIDIAN_DIR" ]]; then
    if [[ -n "$EXISTING_OBSIDIAN" ]]; then
        OBSIDIAN_DIR="$EXISTING_OBSIDIAN"
    else
        OBSIDIAN_DIR="$DERIVED_OBSIDIAN"
    fi
fi

# Expand tilde
OBSIDIAN_DIR="${OBSIDIAN_DIR/#\~/$HOME}"

if [[ -d "$OBSIDIAN_DIR" ]]; then
    echo -e "${GREEN}✅ Using $OBSIDIAN_DIR${RESET}"
else
    echo -e "${YELLOW}⚠️  Directory '$OBSIDIAN_DIR' doesn't exist (will use anyway)${RESET}"
fi

echo

# Step 3.5: Get user name and assistant name for personalization
echo -e "${CYAN}Step 3.5: Personalizing your experience${RESET}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo

EXISTING_NAME=""
EXISTING_ASSISTANT_NAME=""
if [[ -f "$EXISTING_CONFIG" ]]; then
    source "$EXISTING_CONFIG" 2>/dev/null || true
    EXISTING_NAME="$NAME"
    EXISTING_ASSISTANT_NAME="$ASSISTANT_NAME"
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

echo "Your assistant needs a name too. This becomes part of its identity."
echo -e "${YELLOW}What should your assistant be called?${RESET}"
echo "Examples: Jarvis, Friday, Sable, Alfred"
if [[ -n "$EXISTING_ASSISTANT_NAME" ]]; then
    printf "Assistant name [$EXISTING_ASSISTANT_NAME]: "
else
    printf "Assistant name: "
fi
read -r ASSISTANT_NAME

# Use existing value if no input provided
if [[ -z "$ASSISTANT_NAME" && -n "$EXISTING_ASSISTANT_NAME" ]]; then
    ASSISTANT_NAME="$EXISTING_ASSISTANT_NAME"
elif [[ -z "$ASSISTANT_NAME" ]]; then
    ASSISTANT_NAME="Assistant"  # Default fallback
fi

echo -e "${GREEN}✅ Assistant name: $ASSISTANT_NAME${RESET}"
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
        
        # Remove old files (except backups and config.toml)
        for item in "$MOMENTUM_INSTALL"/*; do
            basename_item="$(basename "$item")"
            if [[ "$basename_item" != ".backups" && "$basename_item" != "config.toml" ]]; then
                rm -rf "$item"
            fi
        done
        echo -e "${GREEN}✅ Existing config.toml preserved${RESET}"
    else
        echo "Keeping existing installation"
    fi
fi

# Copy momentum files
# Always copy components if they're missing
echo "Installing Momentum components..."
mkdir -p "$MOMENTUM_INSTALL"

# Only copy if component doesn't exist or we just backed up
# Legacy prompt files removed - contexts/ directory is now source of truth
# Always update commands (includes orchestration)
rm -rf "$MOMENTUM_INSTALL/commands"
cp -r "$MOMENTUM_SOURCE/commands" "$MOMENTUM_INSTALL/" && echo "  ✓ Commands"
if [[ ! -d "$MOMENTUM_INSTALL/templates" ]]; then
    cp -r "$MOMENTUM_SOURCE/templates" "$MOMENTUM_INSTALL/" && echo "  ✓ Templates"
fi
# Always update resources (used in subagent rendering)
rm -rf "$MOMENTUM_INSTALL/resources"
cp -r "$MOMENTUM_SOURCE/resources" "$MOMENTUM_INSTALL/" && echo "  ✓ Resources"
# Always update subagents (JIT rendered at session start)
rm -rf "$MOMENTUM_INSTALL/subagents"
cp -r "$MOMENTUM_SOURCE/subagents" "$MOMENTUM_INSTALL/" && echo "  ✓ Subagents"
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
cp "$MOMENTUM_SOURCE/hooks/momentum-pre-tool-use-hook.ts" "$MOMENTUM_INSTALL/hooks/" 2>/dev/null && echo "  ✓ Pre-tool-use hook (updated)"
cp "$MOMENTUM_SOURCE/hooks/momentum-post-tool-use-hook.ts" "$MOMENTUM_INSTALL/hooks/" 2>/dev/null && echo "  ✓ Post-tool-use hook (updated)"
cp "$MOMENTUM_SOURCE/hooks/momentum-subagent-start-hook.ts" "$MOMENTUM_INSTALL/hooks/" 2>/dev/null && echo "  ✓ Subagent start hook (updated)"
cp "$MOMENTUM_SOURCE/hooks/momentum-subagent-stop-hook.ts" "$MOMENTUM_INSTALL/hooks/" 2>/dev/null && echo "  ✓ Subagent stop hook (updated)"
cp "$MOMENTUM_SOURCE/hooks/momentum-session-end-hook.ts" "$MOMENTUM_INSTALL/hooks/" 2>/dev/null && echo "  ✓ Session end hook (updated)"
cp "$MOMENTUM_SOURCE/hooks/summarizer-worker.ts" "$MOMENTUM_INSTALL/hooks/" 2>/dev/null && echo "  ✓ Summarizer worker (updated)"
cp "$MOMENTUM_SOURCE/hooks/render-project-prompt.ts" "$MOMENTUM_INSTALL/hooks/" 2>/dev/null && echo "  ✓ Render project prompt (updated)"
# Copy shared utilities
if [[ -d "$MOMENTUM_SOURCE/hooks/shared" ]]; then
    cp -r "$MOMENTUM_SOURCE/hooks/shared" "$MOMENTUM_INSTALL/hooks/" 2>/dev/null && echo "  ✓ Shared voice utilities (updated)"
fi
# Legacy hook for backward compatibility
cp "$MOMENTUM_SOURCE/hooks/momentum-hook.ts" "$MOMENTUM_INSTALL/hooks/" 2>/dev/null && echo "  ✓ Legacy hook (for compatibility)"
chmod +x "$MOMENTUM_INSTALL/hooks"/*.ts 2>/dev/null || true

# Install hook dependencies (llmcli-tools libraries)
if [[ -f "$MOMENTUM_SOURCE/hooks/package.json" ]]; then
    cp "$MOMENTUM_SOURCE/hooks/package.json" "$MOMENTUM_INSTALL/hooks/" 2>/dev/null
    if command -v bun &> /dev/null; then
        (cd "$MOMENTUM_INSTALL/hooks" && bun install --silent 2>/dev/null) && echo "  ✓ Hook dependencies installed"
    fi
fi

# Contexts (injectable prompts for hooks - always update)
mkdir -p "$MOMENTUM_INSTALL/contexts"
cp "$MOMENTUM_SOURCE/contexts"/*.md "$MOMENTUM_INSTALL/contexts/" 2>/dev/null && echo "  ✓ Contexts (updated)"

# Remove legacy context files no longer in source
rm -f "$MOMENTUM_INSTALL/contexts/base-v2.md" 2>/dev/null
rm -f "$MOMENTUM_INSTALL/contexts/project-identity.md" 2>/dev/null
rm -f "$MOMENTUM_INSTALL/contexts/workspace-identity.md" 2>/dev/null

# Install output subdirectories (format, verbosity, annotations)
mkdir -p "$MOMENTUM_INSTALL/contexts/output/format"
mkdir -p "$MOMENTUM_INSTALL/contexts/output/verbosity"
if [[ -d "$MOMENTUM_SOURCE/contexts/output" ]]; then
    cp "$MOMENTUM_SOURCE/contexts/output"/*.md "$MOMENTUM_INSTALL/contexts/output/" 2>/dev/null
    cp "$MOMENTUM_SOURCE/contexts/output/format"/*.md "$MOMENTUM_INSTALL/contexts/output/format/" 2>/dev/null
    cp "$MOMENTUM_SOURCE/contexts/output/verbosity"/*.md "$MOMENTUM_INSTALL/contexts/output/verbosity/" 2>/dev/null
    echo "  ✓ Output contexts (format, verbosity, annotations)"
fi

# Install speech marker files
mkdir -p "$MOMENTUM_INSTALL/contexts/speech"
if [[ -d "$MOMENTUM_SOURCE/contexts/speech" ]]; then
    cp "$MOMENTUM_SOURCE/contexts/speech"/*.md "$MOMENTUM_INSTALL/contexts/speech/" 2>/dev/null && echo "  ✓ Speech markers (updated)"
fi

# Install personality files (moved from voices/styles/)
mkdir -p "$MOMENTUM_INSTALL/personalities"
if [[ -d "$MOMENTUM_SOURCE/personalities" ]]; then
    cp "$MOMENTUM_SOURCE/personalities"/*.toml "$MOMENTUM_INSTALL/personalities/" 2>/dev/null && echo "  ✓ Personalities (updated)"
fi

# Install speech summary verbosity files (moved from voices/verbosity/)
mkdir -p "$MOMENTUM_INSTALL/speech/summaries"
if [[ -d "$MOMENTUM_SOURCE/speech/summaries" ]]; then
    cp "$MOMENTUM_SOURCE/speech/summaries"/*.toml "$MOMENTUM_INSTALL/speech/summaries/" 2>/dev/null && echo "  ✓ Speech summaries (updated)"
fi

# Install profiles (copy if missing - users can customize)
if [[ ! -d "$MOMENTUM_INSTALL/profiles" ]]; then
    cp -r "$MOMENTUM_SOURCE/profiles" "$MOMENTUM_INSTALL/" && echo "  ✓ Profiles (discord, api)"
else
    echo "  ✓ Profiles (existing - preserved)"
fi

# Create TOML configuration only if it doesn't exist (preserve user settings)
if [[ -f "$MOMENTUM_INSTALL/config.toml" ]]; then
    echo -e "${GREEN}✅ Existing config.toml preserved${RESET}"
    echo "   To reset configuration, delete ~/.config/momentum/config.toml and reinstall"
else
    cat > "$MOMENTUM_INSTALL/config.toml" << EOF
# Momentum Configuration
# Edit this file to customize your workflow settings
# Generated: $(date)

[personalization]
# Your name (used in greetings and voice output)
name = "$USER_NAME"
# Your assistant's name (becomes part of its identity)
assistant_name = "$ASSISTANT_NAME"
# IANA timezone for dates/filenames (internal timestamps stay UTC)
timezone = "America/Los_Angeles"

[paths]
# Where your development projects live
dev = "$DEV_DIR"
# Where your planning/documentation lives (Obsidian)
projects = "$PLANNING_DIR"
# Obsidian vault root
obsidian = "$OBSIDIAN_DIR"

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
# Voice style: jarvis, professional, casual, sable, or custom
style = "jarvis"

[voice.verbosity]
# Verbosity level per mode: terse, brief, or normal
assistant = "terse"
project = "brief"

[voice.tts]
# Text-to-Speech configuration
enabled = true
provider = "system"  # Options: "system" (free) or "elevenlabs" (premium)
# model = "eleven_flash_v2_5"  # ElevenLabs model (v3 models support audio tags)
# api_key = ""  # Required for elevenlabs provider
# voice_id = ""  # Required for elevenlabs provider
cache_threshold = 0.90  # Semantic similarity threshold (0.0-1.0)

# Cache control per verbosity level
[voice.tts.cache]
terse = true     # Short, common phrases - use cache
brief = true     # Concise responses - use cache
normal = false   # Longer, unique content - don't cache

[behavior]
# Behavioral calibration dials (0-100)
teaching = 75      # How often to surface first principles
wit = 50           # Personality woven into body text
pushback = 60      # Challenge assumptions when warranted
depth = 80         # Explanation thoroughness

[behavior.teaching_config]
# Teaching system configuration
enabled = true
domains = ["principle", "architecture", "security", "pattern", "testing", "debugging"]
min_confidence = "likely"    # certain, confident, likely, exploring
max_length = "paragraph"     # sentence, paragraph, extended

[behavior.triggers]
# When to activate teaching
on_confusion = true          # User seems confused
on_agreement = true          # Agreeing on approach
on_architecture = true       # Architecture decision made
on_completion = true         # Complex task finished
EOF

    echo -e "${GREEN}✅ TOML configuration created${RESET}"
fi

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
export OBSIDIAN_DIR="$OBSIDIAN_DIR"

# Personalization
export NAME="$USER_NAME"
export ASSISTANT_NAME="$ASSISTANT_NAME"

# Momentum paths
export MOMENTUM_INSTALL="$HOME/.config/momentum"
export MOMENTUM_WORKSPACE="$HOME/.local/share/momentum"
export MOMENTUM_CACHE="$HOME/.cache/momentum"

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

# Step 6: Install momentum launcher script
echo -e "${CYAN}Step 6: Installing momentum launcher${RESET}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo

# Copy momentum script to ~/.local/bin
cp "$MOMENTUM_SOURCE/bin/momentum" "$HOME/.local/bin/momentum"
chmod +x "$HOME/.local/bin/momentum"

echo -e "${GREEN}✅ Momentum launcher installed${RESET}"
echo

# Step 7: Initialize workspace directory
echo -e "${CYAN}Step 7: Initializing workspace${RESET}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo

WORKSPACE_DIR="$HOME/.local/share/momentum/workspace"
mkdir -p "$WORKSPACE_DIR"

# Create .mcp.json for playwright MCP server
cat > "$WORKSPACE_DIR/.mcp.json" << EOF
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "@playwright/mcp@latest"
      ],
      "env": {}
    }
  }
}
EOF

echo -e "${GREEN}✅ Workspace initialized at ~/.local/share/momentum/workspace${RESET}"
echo -e "${GREEN}✅ MCP servers configured (playwright)${RESET}"
echo

# Ensure ~/.local/bin is in PATH
if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
  echo
  echo -e "${YELLOW}⚠️  ~/.local/bin not in PATH${RESET}"
  echo "Add to your shell config:"
  echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
fi
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
echo "Run this command to start:"
echo -e "  ${CYAN}momentum <project-name>${RESET}"
echo
echo "For new projects:"
echo "  momentum new-project  # Creates dirs, runs ideation, sets up structure"
echo
echo
echo -e "${MAGENTA}FIRST PROJECT WORKFLOW:${RESET}"
echo "1. Launch with project name:"
echo -e "   ${CYAN}momentum myapp${RESET}"
echo
echo "2. If project doesn't exist, momentum will:"
echo "   • Offer to create directories"
echo "   • Run ideation to capture your vision"
echo "   • Set up .workflow structure"
echo
echo "3. Once in Claude:"
echo -e "   ${CYAN}/plan-iteration${RESET}  # Plan what to build"
echo -e "   ${CYAN}/plan-task 1${RESET}     # Start first task"
echo
echo "Commands run in terminal:"
echo -e "   ${CYAN}momentum <project>${RESET}  # Switch projects"
echo
echo "Commands run in Claude Code:"
echo -e "   ${CYAN}/plan-iteration${RESET}  # Plan work"
echo -e "   ${CYAN}/plan-task N${RESET}      # Execute tasks"
echo
echo -e "${GREEN}Ship working software every iteration! 🚀${RESET}"