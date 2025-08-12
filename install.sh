#!/bin/bash
# Momentum Installer - Sets up ~/.config/momentum directory with all workflow files

set -e

MOMENTUM_SOURCE="$(cd "$(dirname "$0")" && pwd)"
MOMENTUM_HOME="$HOME/.config/momentum"
GREEN='\033[32m'
YELLOW='\033[33m'
CYAN='\033[36m'
RED='\033[31m'
MAGENTA='\033[35m'
RESET='\033[0m'

echo -e "${MAGENTA}🚀 Installing Momentum Development Workflow${RESET}"
echo -e "${CYAN}Source: $MOMENTUM_SOURCE${RESET}"
echo -e "${CYAN}Target: $MOMENTUM_HOME${RESET}"
echo

# Check for existing installation
if [[ -d "$MOMENTUM_HOME" ]]; then
    echo -e "${YELLOW}⚠️  Existing installation found${RESET}"
    read -p "Overwrite existing momentum installation? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}Installation cancelled${RESET}"
        exit 1
    fi
    echo -e "${YELLOW}Backing up existing installation...${RESET}"
    mv "$MOMENTUM_HOME" "$MOMENTUM_HOME.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Create momentum directory structure
echo -e "${CYAN}📁 Creating momentum directories...${RESET}"
mkdir -p "$MOMENTUM_HOME"

# Copy all momentum components to ~/.momentum
echo -e "${CYAN}📄 Installing momentum agent...${RESET}"
cp -r "$MOMENTUM_SOURCE/agents" "$MOMENTUM_HOME/"

echo -e "${CYAN}📋 Installing commands...${RESET}"
cp -r "$MOMENTUM_SOURCE/commands" "$MOMENTUM_HOME/"

echo -e "${CYAN}📝 Installing templates...${RESET}"
cp -r "$MOMENTUM_SOURCE/templates" "$MOMENTUM_HOME/"

echo -e "${CYAN}📚 Installing resources...${RESET}"
cp -r "$MOMENTUM_SOURCE/resources" "$MOMENTUM_HOME/"

echo -e "${CYAN}🎓 Installing subagents...${RESET}"
cp -r "$MOMENTUM_SOURCE/subagents" "$MOMENTUM_HOME/"

echo -e "${CYAN}👤 Installing user commands...${RESET}"
cp -r "$MOMENTUM_SOURCE/user-commands" "$MOMENTUM_HOME/"

# Create config that points to ~/.momentum
echo -e "${CYAN}⚙️  Creating configuration...${RESET}"
cat > "$MOMENTUM_HOME/config" << 'EOF'
#!/usr/bin/env zsh
# Momentum Configuration
# Source this file to set up momentum paths

# Core Paths (customize these)
export WORKFLOW_PROJECTS="${WORKFLOW_PROJECTS:-$HOME/obsidian/projects}"
export WORKFLOW_DEV="${WORKFLOW_DEV:-$HOME/development/projects}"

# Momentum Installation (points to ~/.config/momentum)
export MOMENTUM_HOME="$HOME/.config/momentum"
export WORKFLOW_HOME="$MOMENTUM_HOME"

# Workflow Components (now in ~/.config/momentum)
export WORKFLOW_COMMANDS="$MOMENTUM_HOME/commands"
export WORKFLOW_TEMPLATES="$MOMENTUM_HOME/templates"
export WORKFLOW_RESOURCES="$MOMENTUM_HOME/resources"
export WORKFLOW_AGENTS="$MOMENTUM_HOME/agents"

# External Integrations (optional)
export WORKFLOW_STANDARDS="${WORKFLOW_STANDARDS:-$HOME/.workflow/standards}"

# Quick Command Paths (for qback, qdiscovery, etc.)
# These use ${PROJECT} which gets resolved at runtime
export WORKFLOW_LATER_TEMPLATE="${WORKFLOW_PROJECTS}/${PROJECT}/later.md"
export WORKFLOW_DISCOVERY_TEMPLATE="${WORKFLOW_PROJECTS}/${PROJECT}/discoveries"

# Function to get current project name from git or directory
get_project_name() {
    # Try git remote first
    local git_remote=$(git remote get-url origin 2>/dev/null | sed 's/.*\///' | sed 's/\.git$//')
    if [[ -n "$git_remote" ]]; then
        echo "$git_remote"
        return
    fi
    
    # Try current directory name if in projects
    local current_dir=$(pwd)
    if [[ "$current_dir" == *"/development/projects/"* ]]; then
        echo "${current_dir#*/development/projects/}" | cut -d'/' -f1
        return
    fi
    
    # Fallback to directory name
    basename "$current_dir"
}

# Aliases for quick access
alias workflow-config="source $MOMENTUM_HOME/config"
alias workflow-home="cd $MOMENTUM_HOME"
alias workflow-projects="cd $WORKFLOW_PROJECTS"
EOF

# Install setupd to PATH
echo -e "${CYAN}🔧 Installing setupd to ~/.local/bin...${RESET}"
mkdir -p "$HOME/.local/bin"
cp "$MOMENTUM_SOURCE/bin/setupd" "$HOME/.local/bin/"
chmod +x "$HOME/.local/bin/setupd"

# Update setupd to use ~/.momentum instead of git repo
# This is handled by the config which setupd sources

# Update shell configuration
echo -e "${CYAN}🐚 Configuring shell...${RESET}"

# Determine shell config file
if [[ -f "$HOME/.zshrc" ]]; then
    SHELL_CONFIG="$HOME/.zshrc"
elif [[ -f "$HOME/.bashrc" ]]; then
    SHELL_CONFIG="$HOME/.bashrc"
else
    SHELL_CONFIG="$HOME/.zshrc"
    echo -e "${YELLOW}Creating $SHELL_CONFIG${RESET}"
    touch "$SHELL_CONFIG"
fi

# Function to add line to file if not present
add_to_file() {
    local file=$1
    local line=$2
    if [[ -f "$file" ]]; then
        if ! grep -Fxq "$line" "$file"; then
            echo "$line" >> "$file"
            echo -e "${GREEN}  ✓ Added to $file${RESET}"
        else
            echo -e "${CYAN}  ○ Already in $file${RESET}"
        fi
    fi
}

echo -e "${CYAN}Adding to $SHELL_CONFIG:${RESET}"

# Add ~/.local/bin to PATH if not already there
if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
    add_to_file "$SHELL_CONFIG" 'export PATH="$HOME/.local/bin:$PATH"'
fi

# Add momentum configuration
add_to_file "$SHELL_CONFIG" ''
add_to_file "$SHELL_CONFIG" '# Momentum Configuration'
add_to_file "$SHELL_CONFIG" 'source ~/.config/momentum/config'
add_to_file "$SHELL_CONFIG" 'export MOMENTUM_HOME="$HOME/.config/momentum"'
add_to_file "$SHELL_CONFIG" ''
add_to_file "$SHELL_CONFIG" '# Momentum alias - activates momentum mode'
add_to_file "$SHELL_CONFIG" '# Run from your project directory to start momentum mode'
add_to_file "$SHELL_CONFIG" '# Sends "Activate Momentum" to trigger the startup sequence'
add_to_file "$SHELL_CONFIG" 'alias momentum='\''source ~/.config/momentum/config && claude --append-system-prompt "$(cat $MOMENTUM_HOME/agents/MOMENTUM.md)" "Activate Momentum"'\'''

# Install universal Claude components
echo -e "${CYAN}📦 Installing universal Claude components...${RESET}"

# Symlink subagents to global claude agents (they're universal)
mkdir -p "$HOME/.claude/agents"
for agent in "$MOMENTUM_HOME/subagents"/*.md; do
    if [[ -f "$agent" ]]; then
        ln -sf "$agent" "$HOME/.claude/agents/$(basename "$agent")"
    fi
done
echo -e "${GREEN}  ✓ Symlinked subagents to ~/.claude/agents${RESET}"

# Symlink user commands to global claude commands (they're universal)
mkdir -p "$HOME/.claude/commands"
if [[ -f "$MOMENTUM_HOME/user-commands/ideate.md" ]]; then
    ln -sf "$MOMENTUM_HOME/user-commands/ideate.md" "$HOME/.claude/commands/ideate.md"
    echo -e "${GREEN}  ✓ Symlinked ideate command to ~/.claude/commands${RESET}"
fi

if [[ -f "$MOMENTUM_HOME/user-commands/plan-idea.md" ]]; then
    ln -sf "$MOMENTUM_HOME/user-commands/plan-idea.md" "$HOME/.claude/commands/plan-idea.md"
    echo -e "${GREEN}  ✓ Symlinked plan-idea command to ~/.claude/commands${RESET}"
fi

# Source config to get WORKFLOW_PROJECTS
source "$MOMENTUM_HOME/config"

# Create obsidian structure if applicable
if [[ -n "$WORKFLOW_PROJECTS" && -d "${WORKFLOW_PROJECTS%/*}" ]]; then
    echo -e "${CYAN}📁 Creating obsidian structure...${RESET}"
    mkdir -p "$WORKFLOW_PROJECTS/../explorations"
    mkdir -p "$WORKFLOW_PROJECTS/../archive/$(date +%Y)"
    echo -e "${GREEN}✅ Created obsidian directories${RESET}"
fi

echo
echo -e "${GREEN}✅ Momentum installed successfully!${RESET}"
echo
echo -e "${CYAN}Installation summary:${RESET}"
echo -e "  • Momentum home: ${YELLOW}$MOMENTUM_HOME${RESET}"
echo -e "  • Commands: ${YELLOW}$MOMENTUM_HOME/commands/${RESET}"
echo -e "  • Templates: ${YELLOW}$MOMENTUM_HOME/templates/${RESET}"
echo -e "  • Config: ${YELLOW}$MOMENTUM_HOME/config${RESET}"
echo -e "  • Setupd: ${YELLOW}$HOME/.local/bin/setupd${RESET}"
echo

# Test if we can run setupd
echo -e "${CYAN}Testing installation...${RESET}"
if command -v setupd &> /dev/null; then
    echo -e "${GREEN}✅ setupd is available in current shell${RESET}"
    echo
    echo -e "${GREEN}You're ready to go!${RESET}"
    echo
    echo -e "${CYAN}Quick start:${RESET}"
    echo -e "  1. Setup a project: ${YELLOW}setupd <project-name>${RESET}"
    echo -e "  2. Start momentum: ${YELLOW}cd ~/development/projects/<project-name> && momentum${RESET}"
else
    echo -e "${YELLOW}⚠️  setupd not found in PATH${RESET}"
    echo
    echo -e "${RED}IMPORTANT: You must reload your shell first!${RESET}"
    echo
    echo -e "${CYAN}Run this command:${RESET}"
    echo -e "  ${YELLOW}source $SHELL_CONFIG${RESET}"
    echo
    echo -e "${CYAN}Then you can:${RESET}"
    echo -e "  1. Setup a project: ${YELLOW}setupd <project-name>${RESET}"
    echo -e "  2. Start momentum: ${YELLOW}cd ~/development/projects/<project-name> && momentum${RESET}"
fi

echo
echo -e "${CYAN}The momentum alias runs:${RESET}"
echo -e "  ${YELLOW}claude --append-system-prompt \"\$(cat ~/.config/momentum/agents/MOMENTUM.md)\"${RESET}"
echo
echo -e "${MAGENTA}Ship working software every iteration! 🚀${RESET}"
