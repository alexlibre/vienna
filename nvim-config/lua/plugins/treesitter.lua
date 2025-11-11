-- ================================
-- Treesitter - подсветка синтаксиса
-- ================================

return {
  "nvim-treesitter/nvim-treesitter",
  build = ":TSUpdate",
  event = { "BufReadPost", "BufNewFile" },
  dependencies = {
    "nvim-treesitter/nvim-treesitter-textobjects",
  },
  config = function()
    require("nvim-treesitter.configs").setup({
      -- Языки для установки
      ensure_installed = {
        "vue",
        "typescript",
        "javascript",
        "tsx",
        "html",
        "css",
        "scss",
        "json",
        "yaml",
        "markdown",
        "markdown_inline",
        "lua",
        "vim",
        "bash",
      },
      
      -- Автоустановка при открытии файла
      auto_install = true,
      
      -- Подсветка синтаксиса
      highlight = {
        enable = true,
        additional_vim_regex_highlighting = false,
      },
      
      -- Отступы на основе Treesitter
      indent = {
        enable = true,
      },
      
      -- Инкрементальное выделение
      incremental_selection = {
        enable = true,
        keymaps = {
          init_selection = "<CR>",
          node_incremental = "<CR>",
          scope_incremental = "<S-CR>",
          node_decremental = "<BS>",
        },
      },
      
      -- Текстовые объекты
      textobjects = {
        select = {
          enable = true,
          lookahead = true,
          keymaps = {
            ["af"] = "@function.outer",
            ["if"] = "@function.inner",
            ["ac"] = "@class.outer",
            ["ic"] = "@class.inner",
          },
        },
      },
    })
  end,
}
