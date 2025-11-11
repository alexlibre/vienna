-- ================================
-- Дерево файлов (nvim-tree)
-- ================================

return {
  "nvim-tree/nvim-tree.lua",
  dependencies = {
    "nvim-tree/nvim-web-devicons",
  },
  cmd = { "NvimTreeToggle", "NvimTreeFocus" },
  keys = {
    { "<leader>e", "<cmd>NvimTreeToggle<cr>", desc = "Toggle file explorer" },
    { "<leader>o", "<cmd>NvimTreeFocus<cr>", desc = "Focus file explorer" },
  },
  config = function()
    require("nvim-tree").setup({
      disable_netrw = true,
      hijack_netrw = true,
      
      view = {
        width = 30,
        side = "left",
        number = false,
        relativenumber = false,
      },
      
      renderer = {
        indent_markers = {
          enable = true,
        },
        icons = {
          glyphs = {
            default = "",
            symlink = "",
            folder = {
              default = "",
              open = "",
              empty = "",
              empty_open = "",
              symlink = "",
            },
            git = {
              unstaged = "✗",
              staged = "✓",
              unmerged = "",
              renamed = "➜",
              untracked = "★",
              deleted = "",
              ignored = "◌",
            },
          },
        },
      },
      
      filters = {
        dotfiles = false,
        custom = { "node_modules", ".git" },
      },
      
      git = {
        enable = true,
        ignore = false,
      },
      
      actions = {
        open_file = {
          quit_on_open = false,
          window_picker = {
            enable = true,
          },
        },
      },
      
      update_focused_file = {
        enable = true,
        update_root = false,
      },
    })
  end,
}
