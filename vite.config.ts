import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// 打包分析工具
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		AutoImport({
			resolvers: [ElementPlusResolver()],
		}),
		Components({
			resolvers: [ElementPlusResolver()],
		}),
		visualizer({
			// gzipSize: true,
			// brotliSize: true,
			// emitFile: false,
			// filename: 'test.html', //分析图生成的文件名
			// open: true, //如果存在本地服务端口，将在打包后自动展示
		}),
	],
	server: {
		host: '0.0.0.0', // 允许IP访问
		// 开发代理
		proxy: {
			'/api': {
				target: 'https://mock.apifox.cn/m1/3331204-0-default',
				secure: true, // 如果是https接口，需要配置这个参数为true
				changeOrigin: true, // 如果接口跨域，需要进行这个参数配置为true
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
			'/crm': {
				// target: 'https://testjlc.kcwl.com', // 建龙5.3测试环境
				target: 'https://testcrm.jlkc56.com', // 建龙5.2测试环境
				// target: 'https://testnmc.kcwl.com', // 内蒙测试环境
				// target: 'http://172.16.50.74:8081',
				// target: 'https://precrm.jlkc56.com', // 建龙二套测试环境
				// target: 'https://testcrm215.jlkc56.com', // 乌海测试环境
				changeOrigin: true,
				// timeout: 3000000, // 5分钟
			},
			'/preference': {
				// target: 'https://testjlc.kcwl.com', // 建龙5.3测试环境
				target: 'https://testcrm.jlkc56.com', // 建龙5.2测试环境
				// target: 'https://testnmc.kcwl.com', // 内蒙测试环境
				// target: 'http://http://192.168.1.156:9818/', // 谭祥美
				// target: 'http://172.16.50.74:8081',
				// target: 'https://preapi.jlkc56.com/', //第二套测试环境
				changeOrigin: true,
				// timeout: 3000000, // 5分钟
			},
		},
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	// 构建
	build: {
		emptyOutDir: true, // 清除dist目录

		chunkSizeWarningLimit: 2000, // 消除打包大小超过500kb警告
		minify: 'terser', // Vite 2.6.x 以上需要配置 minify: "terser", terserOptions 才能生效
		terserOptions: {
			compress: {
				keep_infinity: true, // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
				drop_console: true, // 生产环境去除 console
				drop_debugger: true, // 生产环境去除 debugger
			},
			format: {
				comments: false, // 删除注释
			},
		},
		// 通过() => import()形式加载的组件会自动分包，第三方插件需手动分包
		rollupOptions: {
			output: {
				// 创建自定义的公共 chunk
				manualChunks: {
					vue: ['vue', 'pinia', 'vue-router'],
					// elementIcons: ['@element-plus/icons-vue'],
				},
				// js和css文件夹分离
				// 对代码分割中产生的 chunk 自定义命名，其值也可以是一个函数，对每个 chunk 调用以返回匹配模式
				chunkFileNames: 'static/js/[name]-[hash].js',
				// 用于指定 chunks 的入口文件模式，其值也可以是一个函数，对每个入口 chunk 调用以返回匹配模式
				entryFileNames: 'static/js/[name]-[hash].js',
				// 自定义构建结果中的静态资源名称，或者值为一个函数，对每个资源调用以返回匹配模式
				assetFileNames: (assetInfo) => {
					if (assetInfo.type === 'asset' && /\.(jpe?g|png|gif|svg)$/i.test(assetInfo.name)) {
						return 'static/img/[name].[hash][ext]'
					}
					if (assetInfo.type === 'asset' && /\.(ttf|woff|woff2|eot)$/i.test(assetInfo.name)) {
						return 'static/fonts/[name].[hash][ext]'
					}
					return 'static/[ext]/[name]-[hash].[ext]'
				},
			},
		},
	},
})
