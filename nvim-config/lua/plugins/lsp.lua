-- ================================
-- LSP конфигурация
-- ================================

return {
  "neovim/nvim-lspconfig",
  event = { "BufReadPre", "BufNewFile" },
  dependencies = {
    "williamboman/mason.nvim",
    "williamboman/mason-lspconfig.nvim",
    "hrsh7th/cmp-nvim-lsp",
  },
  config = function()
    -- Mason - менеджер LSP серверов
    require("mason").setup({
      ui = {
        icons = {
          package_installed = "✓",
          package_pending = "➜",
          package_uninstalled = "✗"
        }
      }
    })
    
    -- Mason LSP конфигурация
    require("mason-lspconfig").setup({
      ensure_installed = {
        "volar",           -- Vue Language Server
        "tsserver",        -- TypeScript
        "tailwindcss",     -- TailwindCSS
        "html",            -- HTML
        "cssls",           -- CSS
        "jsonls",          -- JSON
        "eslint",          -- ESLint
      },
      automatic_installation = true,
    })
    
    -- Возможности LSP
    local capabilities = require("cmp_nvim_lsp").default_capabilities()
    
    -- Обработчик при подключении LSP
    local on_attach = function(client, bufnr)
      -- Форматирование при сохранении
      if client.server_capabilities.documentFormattingProvider then
        vim.api.nvim_create_autocmd("BufWritePre", {
          buffer = bufnr,
          callback = function()
            vim.lsp.buf.format({ async = false })
          end,
        })
      end
    end
    
    local lspconfig = require("lspconfig")
    
    -- Vue Language Server (Volar)
    lspconfig.volar.setup({
      capabilities = capabilities,
      on_attach = on_attach,
      filetypes = { "vue", "typescript", "javascript" },
      init_options = {
        typescript = {
          tsdk = vim.fn.getcwd() .. "/node_modules/typescript/lib"
        }
      }
    })
    
    -- TypeScript
    lspconfig.tsserver.setup({
      capabilities = capabilities,
      on_attach = on_attach,
      -- Для Vue проектов - отключаем tsserver для .vue файлов (использует Volar)
      filetypes = { "typescript", "javascript", "javascriptreact", "typescriptreact" },
    })
    
    -- TailwindCSS
    lspconfig.tailwindcss.setup({
      capabilities = capabilities,
      on_attach = on_attach,
      filetypes = { "html", "css", "scss", "javascript", "javascriptreact", "typescript", "typescriptreact", "vue" },
      settings = {
        tailwindCSS = {
          experimental = {
            classRegex = {
              { "cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]" },
              { "cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)" },
            },
          },
        },
      },
    })
    
    -- HTML
    lspconfig.html.setup({
      capabilities = capabilities,
      on_attach = on_attach,
    })
    
    -- CSS
    lspconfig.cssls.setup({
      capabilities = capabilities,
      on_attach = on_attach,
    })
    
    -- JSON
    lspconfig.jsonls.setup({
      capabilities = capabilities,
      on_attach = on_attach,
    })
    
    -- ESLint
    lspconfig.eslint.setup({
      capabilities = capabilities,
      on_attach = on_attach,
      settings = {
        workingDirectory = { mode = "auto" },
      },
    })
    
    -- Диагностика
    vim.diagnostic.config({
      virtual_text = true,
      signs = true,
      update_in_insert = false,
      underline = true,
      severity_sort = true,
      float = {
        border = "rounded",
        source = "always",
      },
    })
    
    -- Иконки для диагностики
    local signs = { Error = " ", Warn = " ", Hint = " ", Info = " " }
    for type, icon in pairs(signs) do
      local hl = "DiagnosticSign" .. type
      vim.fn.sign_define(hl, { text = icon, texthl = hl, numhl = hl })
    end
  end,
}
