// 解决 .vue后缀的文件导入时ts解析错误问题
declare module '*.vue' {
	import { Component } from 'vue'
	const component: Component
	export default component
}

declare module '*.ts' {
	const content: any
	export default content
}

declare module 'crypto-js'
declare module 'js-cookie'
declare module 'vue3-image-preview'
declare module 'nprogress'
