import { URL, fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pages from 'vite-plugin-pages'
import jsx from '@vitejs/plugin-vue-jsx'
import autoImport from 'unplugin-auto-import/vite'
import components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: './',

  build: {
    cssMinify: 'lightningcss',
    // 是否输出 gzip 压缩大小的报告，设置 false 可以提高构建速度
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vueuse: ['@vueuse/core'],
        },
      },
    },
  },

  css: {
    devSourcemap: true,
  },

  esbuild: {
    target: 'esnext',
    // 在生产环境下去掉 console/debugger
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },

  optimizeDeps: {
    include: ['vue', 'pinia', 'vue-router', 'canvas-confetti', 'localforage'],
    exclude: ['vue-demi'],
  },

  plugins: [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    }),

    jsx(),

    components({
      dts: './shims/components.d.ts',
      extensions: ['vue', 'tsx'],
      // globs: ['src/components/**/index.{vue,tsx,ts}']
    }),

    pages({
      dirs: 'src/views',
      routeBlockLang: 'yaml',
      extensions: ['vue', 'tsx'],
      exclude: [
        '**/*/components/**/*',
        '**/*/composables/**/*',
        '**/*/styles/**/*',
        '**/*/utils/**/*',
      ],
    }),

    autoImport({
      dirs: [
        './src/composables/**',
      ],
      dts: './shims/auto-imports.d.ts',
      imports: [
        'vue',
        'vue-router',
      ],
    }),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  // server: {
  //   open: true,
  //   proxy: {
  //     '/api': {
  //       changeOrigin: true,
  //       target: 'http://localhost:3000',
  //       rewrite: (path) => path.replace(/^\/api/, '')
  //     }
  //   }
  // }
}))
