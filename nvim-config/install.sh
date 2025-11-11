#!/data/data/com.termux/files/usr/bin/bash

# ================================
# Автоматический установщик Neovim конфигурации для Termux
# ================================

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "================================================"
echo "  Установка Neovim для Frontend разработки"
echo "  Vue.js + TailwindCSS в Termux"
echo "================================================"
echo -e "${NC}"

# Функция для вывода статуса
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${YELLOW}[i]${NC} $1"
}

# Проверка что мы в Termux
if [ ! -d "/data/data/com.termux" ]; then
    print_error "Этот скрипт предназначен для Termux!"
    exit 1
fi

print_info "Начинаем установку..."
sleep 2

# ===== Шаг 1: Обновление пакетов =====
echo -e "\n${BLUE}Шаг 1: Обновление пакетов Termux${NC}"
print_info "Обновление списка пакетов..."
pkg update -y
print_info "Обновление установленных пакетов..."
pkg upgrade -y
print_status "Пакеты обновлены"

# ===== Шаг 2: Установка зависимостей =====
echo -e "\n${BLUE}Шаг 2: Установка необходимых пакетов${NC}"
PACKAGES="neovim git nodejs python ripgrep fd lazygit wget curl unzip make gcc"
print_info "Установка: $PACKAGES"
pkg install -y $PACKAGES
print_status "Пакеты установлены"

# Проверка версии Node.js
NODE_VERSION=$(node --version)
print_info "Версия Node.js: $NODE_VERSION"

# ===== Шаг 3: Установка Node.js пакетов =====
echo -e "\n${BLUE}Шаг 3: Установка LSP серверов${NC}"
print_info "Установка глобальных npm пакетов..."

npm install -g \
    @vue/language-server \
    typescript \
    typescript-language-server \
    @tailwindcss/language-server \
    vscode-langservers-extracted \
    eslint \
    prettier

print_status "LSP серверы установлены"

# ===== Шаг 4: Резервное копирование старой конфигурации =====
echo -e "\n${BLUE}Шаг 4: Подготовка конфигурации${NC}"
NVIM_CONFIG="$HOME/.config/nvim"

if [ -d "$NVIM_CONFIG" ]; then
    BACKUP_DIR="$HOME/.config/nvim.backup.$(date +%Y%m%d_%H%M%S)"
    print_info "Найдена существующая конфигурация"
    print_info "Создание резервной копии в: $BACKUP_DIR"
    mv "$NVIM_CONFIG" "$BACKUP_DIR"
    print_status "Резервная копия создана"
fi

# ===== Шаг 5: Копирование конфигурации =====
echo -e "\n${BLUE}Шаг 5: Установка конфигурации Neovim${NC}"
print_info "Создание директории конфигурации..."
mkdir -p "$NVIM_CONFIG"

# Определение директории скрипта
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
print_info "Копирование файлов из: $SCRIPT_DIR"

# Копирование всех файлов кроме install.sh и INSTALL.md
cp "$SCRIPT_DIR/init.lua" "$NVIM_CONFIG/" 2>/dev/null || true
cp -r "$SCRIPT_DIR/lua" "$NVIM_CONFIG/" 2>/dev/null || true

print_status "Конфигурация установлена"

# ===== Шаг 6: Создание необходимых директорий =====
echo -e "\n${BLUE}Шаг 6: Создание дополнительных директорий${NC}"
mkdir -p "$HOME/.local/share/nvim"
mkdir -p "$HOME/.local/state/nvim"
mkdir -p "$HOME/.cache/nvim"
print_status "Директории созданы"

# ===== Шаг 7: Первый запуск Neovim =====
echo -e "\n${BLUE}Шаг 7: Инициализация Neovim${NC}"
print_info "Первый запуск Neovim для установки плагинов..."
print_info "Это может занять 2-5 минут, пожалуйста подождите..."

# Запуск Neovim в headless режиме для установки плагинов
nvim --headless "+Lazy! sync" +qa 2>&1 | grep -v "^$" || true

print_status "Плагины установлены"

# ===== Завершение =====
echo -e "\n${GREEN}"
echo "================================================"
echo "  ✓ Установка завершена успешно!"
echo "================================================"
echo -e "${NC}"

echo -e "${YELLOW}Следующие шаги:${NC}"
echo "1. Запустите: ${GREEN}nvim${NC}"
echo "2. Подождите завершения установки Treesitter парсеров"
echo "3. Проверьте LSP серверы: ${GREEN}:Mason${NC}"
echo "4. Проверьте здоровье системы: ${GREEN}:checkhealth${NC}"
echo ""
echo -e "${YELLOW}Полезные команды:${NC}"
echo "  ${GREEN}<Space>e${NC}  - Открыть дерево файлов"
echo "  ${GREEN}<Space>ff${NC} - Найти файлы"
echo "  ${GREEN}<Space>gg${NC} - LazyGit"
echo "  ${GREEN}:help${NC}    - Помощь Neovim"
echo ""
echo -e "${BLUE}Документация: ${NC}$(dirname "${BASH_SOURCE[0]}")/INSTALL.md"
echo ""
echo -e "${GREEN}Приятной разработки! 🚀${NC}"
