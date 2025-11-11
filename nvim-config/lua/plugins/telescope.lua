-- ================================
-- Telescope - поиск файлов и текста
-- ================================

return {
  "nvim-telescope/telescope.nvim",
  cmd = "Telescope",
  version = false,
  dependencies = {
    "nvim-lua/plenary.nvim",
    "nvim-tree/nvim-web-devicons",
    {
      "nvim-telescope/telescope-fzf-native.nvim",
      build = "make",
    },
  },
  keys = {
    { "<leader>ff", "<cmd>Telescope find_files<cr>", desc = "Find files" },
    { "<leader>fg", "<cmd>Telescope live_grep<cr>", desc = "Live grep" },
    { "<leader>fb", "<cmd>Telescope buffers<cr>", desc = "Buffers" },
    { "<leader>fh", "<cmd>Telescope help_tags<cr>", desc = "Help tags" },
    { "<leader>fr", "<cmd>Telescope oldfiles<cr>", desc = "Recent files" },
    { "<leader>fc", "<cmd>Telescope git_commits<cr>", desc = "Git commits" },
    { "<leader>fs", "<cmd>Telescope git_status<cr>", desc = "Git status" },
  },
  config = function()
    local telescope = require("telescope")
    local actions = require("telescope.actions")
    
    telescope.setup({
      defaults = {
        prompt_prefix = " ",
        selection_caret = " ",
        path_display = { "truncate" },
        
        mappings = {
          i = {
            ["<C-j>"] = actions.move_selection_next,
            ["<C-k>"] = actions.move_selection_previous,
            ["<C-q>"] = actions.send_selected_to_qflist + actions.open_qflist,
            ["<Esc>"] = actions.close,
          },
          n = {
            ["q"] = actions.close,
          },
        },
        
        file_ignore_patterns = {
          "node_modules",
          ".git/",
          "dist/",
          "build/",
          "%.lock",
        },
      },
      
      pickers = {
        find_files = {
          hidden = true,
        },
      },
      
      extensions = {
        fzf = {
          fuzzy = true,
          override_generic_sorter = true,
          override_file_sorter = true,
          case_mode = "smart_case",
        },
      },
    })
    
    -- Загрузка расширений
    telescope.load_extension("fzf")
  end,
}
