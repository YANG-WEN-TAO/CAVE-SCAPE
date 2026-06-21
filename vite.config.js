import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'

// Vite 配置 - 敦煌 3DShow 数字展馆
// 针对大体积 glb 模型做分包压缩、Gzip 传输优化
export default defineConfig({
  server: {
    port: 3000,
    open: true,
    // 允许加载大文件
    fs: {
      strict: false
    }
  },
  build: {
    // 分包策略：three.js 单独打包
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three'],
        }
      }
    },
    // 资源分包大小警告阈值（glb 模型较大）
    chunkSizeWarningLimit: 80000,
    // 启用压缩
    minify: 'esbuild',
  },
  plugins: [
    // Gzip 压缩 - 加速 glb 模型传输
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,  // 超过 10KB 的文件启用压缩
      deleteOriginFile: false,
    }),
  ],
  // 静态资源优化
  assetsInclude: ['**/*.glb', '**/*.gltf'],
})
