#!/bin/bash
# Workflow System Installer - Agent-agnostic

set -e

WORKFLOW_HOME="$(cd "$(dirname "$0")" && pwd)"
GREEN='\033[32m'
YELLOW='\033[33m'
CYAN='\033[36m'
RED='\033[31m'
RESET='\033[0m'

# Parse arguments
AGENT=${1:-claude}
GIT_NAME=""
GIT_EMAIL=""
USER_EMAIL=""
USER_TIMEZONE=""

# Parse optional flags
shift # Remove agent argument
while [[ $# -gt 0 ]]; do
  case $1 in
    --name=*)
      GIT_NAME="${1#*=}"
      shift
      ;;
    --git-email=*)
      GIT_EMAIL="${1#*=}"
      shift
      ;;
    --email=*)
      USER_EMAIL="${1#*=}"
      shift
      ;;
    --timezone=*)
      USER_TIMEZONE="${1#*=}"
      shift
      ;;
    *)
      echo -e "${RED}❌ Unknown option: $1${RESET}"
      exit 1
      ;;
  esac
done

echo -e "${CYAN}Installing Workflow System...${RESET}"
echo -e "${CYAN}Agent: $AGENT${RESET}"

# Install setupd to PATH
mkdir -p ~/.local/bin
cp $WORKFLOW_HOME/bin/setupd ~/.local/bin/
chmod +x ~/.local/bin/setupd
echo -e "${GREEN}✅ Installed setupd to ~/.local/bin${RESET}"

# Create config directory
mkdir -p ~/.config/momentum

# Create user config from template (don't overwrite)
if [[ ! -f ~/.config/momentum/config ]]; then
    cp $WORKFLOW_HOME/config ~/.config/momentum/config
    echo -e "${GREEN}✅ Created config at ~/.config/momentum/config${RESET}"
else
    echo -e "${YELLOW}ℹ️  Config already exists at ~/.config/momentum/config${RESET}"
fi

# Install agent configuration based on tool
case $AGENT in
  claude)
    mkdir -p ~/.claude
    if [[ -L ~/.claude/CLAUDE.md ]]; then
        rm ~/.claude/CLAUDE.md
    elif [[ -f ~/.claude/CLAUDE.md ]]; then
        mv ~/.claude/CLAUDE.md ~/.claude/CLAUDE.md.backup
        echo -e "${YELLOW}⚠️  Backed up existing CLAUDE.md${RESET}"
    fi
    
    # Check if personalization flags provided
    if [[ -n "$GIT_NAME" && -n "$GIT_EMAIL" && -n "$USER_EMAIL" && -n "$USER_TIMEZONE" ]]; then
      echo -e "${CYAN}Creating personalized Claude config...${RESET}"
      # Create personalized CLAUDE.md
      sed -e "s|{YOUR_GIT_NAME}|$GIT_NAME|g" \
          -e "s|{YOUR_GIT_EMAIL}|$GIT_EMAIL|g" \
          -e "s|{YOUR_EMAIL}|$USER_EMAIL|g" \
          -e "s|{YOUR_TIMEZONE}|$USER_TIMEZONE|g" \
          "$WORKFLOW_HOME/agents/CLAUDE.md" > ~/.claude/CLAUDE.md
      echo -e "${GREEN}✅ Installed personalized agent config for Claude${RESET}"
    else
      # Install template version
      cp $WORKFLOW_HOME/agents/CLAUDE.md ~/.claude/CLAUDE.md
      echo -e "${GREEN}✅ Installed agent config template for Claude${RESET}"
      echo -e "${YELLOW}💡 Edit ~/.claude/CLAUDE.md to add your personal details${RESET}"
    fi
    
    # Install user commands (global)
    mkdir -p ~/.claude/commands
    cp $WORKFLOW_HOME/user-commands/*.md ~/.claude/commands/
    echo -e "${GREEN}✅ Installed user commands (global)${RESET}"
    
    # Install custom subagents
    mkdir -p ~/.claude/agents
    ln -sf $WORKFLOW_HOME/subagents/architecture-analyst.md ~/.claude/agents/
    ln -sf $WORKFLOW_HOME/subagents/implementation-analyst.md ~/.claude/agents/
    ln -sf $WORKFLOW_HOME/subagents/architecture-auditor.md ~/.claude/agents/
    echo -e "${GREEN}✅ Installed custom subagents${RESET}"
    
    # Source config to get WORKFLOW_PROJECTS
    if [[ -f ~/.config/momentum/config ]]; then
      source ~/.config/momentum/config
    fi
    
    # Create obsidian structure using environment variable
    if [[ -n "$WORKFLOW_PROJECTS" && -d "${WORKFLOW_PROJECTS%/*}" ]]; then
      mkdir -p "$WORKFLOW_PROJECTS/../explorations"
      mkdir -p "$WORKFLOW_PROJECTS/../archive/$(date +%Y)"
      echo -e "${GREEN}✅ Created obsidian exploration structure${RESET}"
    fi
    ;;
  
  manual)
    echo -e "${YELLOW}📝 Manual agent setup:${RESET}"
    echo -e "${CYAN}   Copy $WORKFLOW_HOME/agents/CLAUDE.md to your tool's config location${RESET}"
    echo -e "${CYAN}   Example: cp $WORKFLOW_HOME/agents/CLAUDE.md ~/.yourtool/config${RESET}"
    ;;
  
  *)
    echo -e "${RED}❌ Unknown agent: $AGENT${RESET}"
    echo -e "${CYAN}Supported: claude, manual${RESET}"
    echo -e "${CYAN}Use 'manual' for tools we don't know about yet${RESET}"
    exit 1
    ;;
esac

# Add to shell profile (check if already added)
if ! grep -q "Workflow System" ~/.zshrc 2>/dev/null; then
    echo "" >> ~/.zshrc
    echo "# Workflow System" >> ~/.zshrc
    echo "[[ -f ~/.config/momentum/config ]] && source ~/.config/momentum/config" >> ~/.zshrc
    echo -e "${GREEN}✅ Added to ~/.zshrc${RESET}"
else
    echo -e "${YELLOW}ℹ️  Already in ~/.zshrc${RESET}"
fi

# Check if ~/.local/bin is in PATH
if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
    echo -e "${YELLOW}⚠️  Add ~/.local/bin to your PATH:${RESET}"
    echo -e "${CYAN}    export PATH=\"\$HOME/.local/bin:\$PATH\"${RESET}"
fi

echo ""
echo -e "${GREEN}✅ Workflow System installed successfully!${RESET}"
echo ""
echo -e "${CYAN}📁 Workflow home: $WORKFLOW_HOME${RESET}"
echo -e "${CYAN}⚙️  Config: ~/.config/momentum/config${RESET}"
echo -e "${CYAN}🤖 Agent: $AGENT${RESET}"
echo -e "${CYAN}🚀 Usage: setupd <project-name>${RESET}"
echo ""
echo -e "${YELLOW}💡 Reload your shell or run: source ~/.zshrc${RESET}"
echo ""
echo -e "${CYAN}Examples:${RESET}"
echo -e "${CYAN}  Basic install: ./install.sh claude${RESET}"
echo -e "${CYAN}  Personalized:  ./install.sh claude --name=\"John Doe\" --git-email=\"john@example.com\" --email=\"john@company.com\" --timezone=\"America/New_York\"${RESET}"
echo -e "${CYAN}  Other tools:   ./install.sh manual${RESET}"