import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import autoImport from 'unplugin-auto-import/vite'
import pages from 'vite-plugin-pages'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: './',

  build: {
    // 是否输出 gzip 压缩大小的报告，设置 false 可以提高构建速度
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-dom': ['react-dom', 'react-router-dom'],
          'ui-vendor': ['antd'],
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
    include: ['react', 'react-dom', 'react-router-dom', 'react-dom/client', 'antd', 'use-immer'],
  },

  plugins: [
    react(),

    pages({
      dirs: ['src/pages'],
      extensions: ['tsx'],
      exclude: ['**/components/**/*'],
    }),
    // https://github.com/antfu/unplugin-auto-import
    autoImport({
      include: [/\.[tj]sx?$/],
      dirs: ['./src/hooks/**/*'],
      dts: './shims/imports.d.ts',
      imports: [
        'react',
        'react-router-dom',
        {
          'clsx': [['default', 'cls']],
          // react: ['createContext'],
          'use-immer': ['useImmer', 'useImmerReducer'],
        },
      ],
      // resolvers: [
      //   IconsResolver({
      //     componentPrefix: 'Icon',
      //   }),
      // ],
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
  // },
}))
