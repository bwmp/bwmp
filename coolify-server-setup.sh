#!/bin/bash

# ZSH Setup Script with Oh My Zsh and Powerlevel10k
# 
# CONFIGURATION:
# To use a pre-configured Powerlevel10k setup:
# 1. Configure Powerlevel10k on any machine with 'p10k configure'
# 2. Upload your ~/.p10k.zsh file to a public URL (GitHub, etc.)
# 3. Update the P10K_CONFIG_URL variable below with your URL
# 4. Run this script - it will auto-download and apply your config
#
# If P10K_CONFIG_URL is empty or unreachable, the script will work normally
# and you'll need to run 'p10k configure' manually after installation.

# ==== CONFIGURATION ====
# Set your Powerlevel10k config URL here (leave empty to skip auto-download)
P10K_CONFIG_URL="https://raw.githubusercontent.com/bwmp/bwmp/main/.p10k.zsh"
# P10K_CONFIG_URL=""  # Uncomment this line to disable auto-download

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
    print_error "Please run this script as a regular user (not root)"
    print_status "The script will use sudo when needed"
    exit 1
fi

# Get the current user
CURRENT_USER=$(whoami)
USER_HOME="/home/$CURRENT_USER"

print_status "Setting up zsh for user: $CURRENT_USER"

# Update package list
print_status "Updating package list..."
sudo apt update

# Install zsh and dependencies
print_status "Installing zsh and dependencies..."
sudo apt install -y zsh git curl wget

# Install Oh My Zsh for current user
print_status "Installing Oh My Zsh for $CURRENT_USER..."
if [ ! -d "$USER_HOME/.oh-my-zsh" ]; then
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
    print_success "Oh My Zsh installed for $CURRENT_USER"
else
    print_warning "Oh My Zsh already exists for $CURRENT_USER"
fi

# Install useful plugins for current user
print_status "Installing zsh plugins for $CURRENT_USER..."

# zsh-autosuggestions
if [ ! -d "$USER_HOME/.oh-my-zsh/custom/plugins/zsh-autosuggestions" ]; then
    git clone https://github.com/zsh-users/zsh-autosuggestions.git "$USER_HOME/.oh-my-zsh/custom/plugins/zsh-autosuggestions"
    print_success "zsh-autosuggestions installed"
fi

# zsh-syntax-highlighting
if [ ! -d "$USER_HOME/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting" ]; then
    git clone https://github.com/zsh-users/zsh-syntax-highlighting.git "$USER_HOME/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting"
    print_success "zsh-syntax-highlighting installed"
fi

# Install Powerlevel10k theme for current user
print_status "Installing Powerlevel10k theme for $CURRENT_USER..."
if [ ! -d "$USER_HOME/.oh-my-zsh/custom/themes/powerlevel10k" ]; then
    git clone --depth=1 https://github.com/romkatv/powerlevel10k.git "$USER_HOME/.oh-my-zsh/custom/themes/powerlevel10k"
    print_success "Powerlevel10k theme installed"
fi

# Download pre-configured p10k config (optional)
if [ -n "$P10K_CONFIG_URL" ]; then
    print_status "Downloading Powerlevel10k configuration..."
    if curl -fsSL "$P10K_CONFIG_URL" -o "$USER_HOME/.p10k.zsh" 2>/dev/null; then
        print_success "Powerlevel10k config downloaded and applied"
    else
        print_warning "Could not download config from $P10K_CONFIG_URL"
        print_status "You'll need to run 'p10k configure' manually after first login"
    fi
else
    print_status "No P10K_CONFIG_URL set - you'll configure Powerlevel10k manually"
fi

# Configure .zshrc for current user
print_status "Configuring .zshrc for $CURRENT_USER..."
cat > "$USER_HOME/.zshrc" << 'EOF'
# Path to your oh-my-zsh installation.
export ZSH="$HOME/.oh-my-zsh"

# Set name of the theme to load
ZSH_THEME="powerlevel10k/powerlevel10k"

# Plugins
plugins=(
    git
    sudo
    zsh-autosuggestions
    zsh-syntax-highlighting
    colored-man-pages
    command-not-found
)

source $ZSH/oh-my-zsh.sh

# User configuration
export LANG=en_US.UTF-8
export EDITOR='nano'

# Aliases
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
EOF

print_success ".zshrc configured for $CURRENT_USER"

# Set up zsh for root
print_status "Setting up zsh for root user..."
sudo bash << 'ROOTSCRIPT'
ROOT_HOME="/root"

# Install Oh My Zsh for root
if [ ! -d "$ROOT_HOME/.oh-my-zsh" ]; then
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
fi

# Install plugins for root
if [ ! -d "$ROOT_HOME/.oh-my-zsh/custom/plugins/zsh-autosuggestions" ]; then
    git clone https://github.com/zsh-users/zsh-autosuggestions.git "$ROOT_HOME/.oh-my-zsh/custom/plugins/zsh-autosuggestions"
fi

if [ ! -d "$ROOT_HOME/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting" ]; then
    git clone https://github.com/zsh-users/zsh-syntax-highlighting.git "$ROOT_HOME/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting"
fi

# Install Powerlevel10k theme for root
if [ ! -d "$ROOT_HOME/.oh-my-zsh/custom/themes/powerlevel10k" ]; then
    git clone --depth=1 https://github.com/romkatv/powerlevel10k.git "$ROOT_HOME/.oh-my-zsh/custom/themes/powerlevel10k"
fi

# Download pre-configured p10k config for root (same URL as user)
if [ -n "$P10K_CONFIG_URL" ]; then
    if curl -fsSL "$P10K_CONFIG_URL" -o "$ROOT_HOME/.p10k.zsh" 2>/dev/null; then
        echo "Powerlevel10k config downloaded for root"
    fi
fi

# Configure .zshrc for root
cat > "$ROOT_HOME/.zshrc" << 'EOF'
# Path to your oh-my-zsh installation.
export ZSH="$HOME/.oh-my-zsh"

# Set name of the theme to load
ZSH_THEME="powerlevel10k/powerlevel10k"

# Plugins
plugins=(
    git
    sudo
    zsh-autosuggestions
    zsh-syntax-highlighting
    colored-man-pages
    command-not-found
)

source $ZSH/oh-my-zsh.sh

# User configuration
export LANG=en_US.UTF-8
export EDITOR='nano'

# Aliases
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
EOF
ROOTSCRIPT

print_success "zsh configured for root user"

# Change default shell to zsh for current user
print_status "Changing default shell to zsh for $CURRENT_USER..."
sudo chsh -s $(which zsh) $CURRENT_USER
print_success "Default shell changed to zsh for $CURRENT_USER"

# Change default shell to zsh for root
print_status "Changing default shell to zsh for root..."
sudo chsh -s $(which zsh) root
print_success "Default shell changed to zsh for root"

print_success "Zsh setup completed!"
print_status "Please log out and log back in (or restart your terminal) to start using zsh"

# Check if config was downloaded
if [ -f "$USER_HOME/.p10k.zsh" ]; then
    print_success "Powerlevel10k is pre-configured and ready to use!"
else
    print_status "When you first start zsh, Powerlevel10k will guide you through the configuration"
fi

print_status "You can reconfigure the theme anytime by running: p10k configure"

echo ""
print_status "Installed features:"
echo "  • Oh My Zsh framework"
echo "  • Powerlevel10k theme (modern and fast)"
echo "  • zsh-autosuggestions (suggests commands as you type)"
echo "  • zsh-syntax-highlighting (highlights commands)"
echo "  • Useful aliases and plugins"
echo ""
print_status "To switch to zsh immediately, run: exec zsh"
