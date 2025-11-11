-- ================================
-- Базовые настройки Neovim
-- ================================

local opt = vim.opt

-- Интерфейс
opt.number = true              -- Номера строк
opt.relativenumber = true      -- Относительные номера строк
opt.signcolumn = "yes"         -- Колонка для знаков (git, lsp)
opt.cursorline = true          -- Подсветка текущей строки
opt.termguicolors = true       -- True color поддержка
opt.wrap = false               -- Не переносить длинные строки
opt.scrolloff = 8              -- Отступ при скролле
opt.sidescrolloff = 8          -- Боковой отступ при скролле

-- Табуляция и отступы
opt.tabstop = 2                -- Ширина табуляции
opt.shiftwidth = 2             -- Ширина отступа
opt.expandtab = true           -- Пробелы вместо табов
opt.smartindent = true         -- Умные отступы
opt.autoindent = true          -- Автоотступы

-- Поиск
opt.ignorecase = true          -- Игнорировать регистр при поиске
opt.smartcase = true           -- Учитывать регистр если есть заглавные
opt.hlsearch = true            -- Подсветка результатов поиска
opt.incsearch = true           -- Инкрементальный поиск

-- Редактирование
opt.undofile = true            -- Сохранение истории отмен
opt.swapfile = false           -- Отключить swap файлы
opt.backup = false             -- Отключить backup файлы
opt.clipboard = "unnamedplus"  -- Системный буфер обмена
opt.mouse = "a"                -- Поддержка мыши

-- Разделение окон
opt.splitbelow = true          -- Новое окно снизу
opt.splitright = true          -- Новое окно справа

-- Производительность
opt.updatetime = 300           -- Быстрее обновление
opt.timeoutlen = 500           -- Время ожидания комбинаций

-- Дополнительно
opt.completeopt = "menu,menuone,noselect"  -- Настройки автодополнения
opt.conceallevel = 0           -- Не скрывать markdown символы
opt.fileencoding = "utf-8"     -- Кодировка файлов
opt.pumheight = 10             -- Высота popup меню
opt.showmode = false           -- Не показывать режим (есть в statusline)
opt.showtabline = 2            -- Всегда показывать табы
opt.laststatus = 3             -- Глобальный statusline

-- Отключить встроенные плагины
vim.g.loaded_netrw = 1
vim.g.loaded_netrwPlugin = 1
