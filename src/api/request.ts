import Axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

import store from '@/store'
import router from '@/router'

import { sign, md5 } from '@/utils/crypto'
import { removeToken, getToken, getSSID } from '@/utils/auth'

// 创建axios实例
const service = Axios.create({
	timeout: 5000,
	baseURL: '/',
	headers: { 'Content-Type': 'application/json;charset=utf-8' },
})

/**
 * 请求头
 */
const header = () => {
	const userStore = store.useUserStore()
	const config_ = {
		'X-Kcrm-SSID': '',
		'X-Kcrm-Nonce': '',
		'X-Kcrm-Timestamp': '',
		'X-Kcrm-Sign': '',
	}
	// 随机数
	const nonce = Math.ceil(Math.random() * 1000000000000000) // 16位随机数
	config_['X-Kcrm-Nonce'] = nonce
	// 时间戳
	const timestamp = new Date().getTime() // 时间戳 整数 毫秒数
	config_['X-Kcrm-Timestamp'] = timestamp
	// 获取SSID
	let ssid = userStore.ssid
	if (!ssid) {
		ssid = getSSID()
	}
	// 获取key
	// const keyString = getToken() || '';
	// const key = keyString.substring(0, 16);
	// const KP = {
	//     key: key, // 秘钥 16*n:
	//     iv: key // 偏移量
	// };
	// const ssid = 'WTNPPm8BwcT6WJ8QhDzI9nStso9EFYA';
	config_['X-Kcrm-SSID'] = ssid
	// 签名串
	// const signstr = sign(KP, ssid, nonce, timestamp);
	// console.log(signstr);
	// config_["X-Kcrm-Sign"] = signstr;
	return config_
}

// 需要使用md5加密的url
const MD5_URL = [
	'/crm/sys/login',
	'/crm/sys/getCaptcha',
	'/crm/sys/getLoginSecretKey',
	'/crm/crm/getCrmAppInfo',
	'/crm/sys/getAjCaptcha',
	'/crm/sys/checkAjCaptcha',
]

// 请求拦截器
// request拦截器
service.interceptors.request.use(
	(config: any) => {
		if (getSSID()) {
			// 判定是否有ssid 如果有的话处理sign信息，在之后的每个http请求中加在header中
			const config_ = header()
			config.headers['X-Kcrm-SSID'] = config_['X-Kcrm-SSID']
			config.headers['X-Kcrm-Nonce'] = config_['X-Kcrm-Nonce']
			config.headers['X-Kcrm-Timestamp'] = config_['X-Kcrm-Timestamp']
			// 签名串
			// 获取key
			const keyString = getToken() || ''
			const key = keyString.substring(0, 16)
			const KP = {
				key: key, // 秘钥 16*n:
				iv: key, // 偏移量
			}
			const url = config.url.split('?')[0] // 截取接口，摒弃参数
			const signstr = sign(KP, config_['X-Kcrm-SSID'], config_['X-Kcrm-Nonce'], config_['X-Kcrm-Timestamp'], url)
			config.headers['X-Kcrm-Sign'] = signstr
		}
		const { url, method } = config
		const timestamp = new Date().getTime() // 时间戳 整数 毫秒数
		// 判断该接口是否未做加签与重放校验
		if (MD5_URL.indexOf(url) > -1) {
			// 针对于这类接口新增拦截器校验，校验前端传入X-Kcrm-Auth
			// X-Kcrm-Auth构成规则md5(接口路径)+时间戳（毫秒级）
			config.headers['X-Kcrm-Auth'] = `${md5(url)}${timestamp}`
		}
		// 增加get请求参数：时间戳
		if (method === 'get') {
			config.params = {
				timestamp: Date.parse(new Date() as any) / 1000,
				...config.params,
			}
		}
		return config
	},
	(error) => {
		Promise.reject(error)
	}
)

// 响应拦截器
// response 拦截器
service.interceptors.response.use(
	(response: any) => {
		const res = response
		if (res.data.code && res.data.code !== 0) {
			switch (res.data.code) {
				case 10007:
					ElMessage.closeAll()
					ElMessage({
						message: res.data.message,
						type: 'error',
						duration: 3 * 1000,
					})
					return response // 用于更换验证码
				case 10001:
				case 10002: //  用户未登录
				case 10004:
				case 10005:
					ElMessageBox({
						title: '登录已过期',
						type: 'warning',
						message: '很抱歉，登录已过期，请重新登录',
						confirmButtonText: '重新登录',
						showClose: false,
						closeOnClickModal: false,
						closeOnPressEscape: false,
						callback: () => {
							// debugger
							// store
							// 	.dispatch('LogOut')
							// 	.then(() => {
							// 		location.reload()
							// 	})
							// 	.catch((err) => {
							// 		removeToken()
							// 		location.reload()
							// 	})
						},
					})
					break
				default: // 这里除了目前文档定义好的编码后台还会不定的加其他错误编码编码
					ElMessage.closeAll()
					ElMessage({
						message: res.data.message,
						type: 'error',
						duration: 3 * 1000,
					})
					return response
			}
		} else {
			return response
		}
	},
	(error) => {
		if (error && error.response) {
			switch (error.response.status) {
				case 400:
					// error.message = '请求错误(400)';
					router.push({
						name: 'error_400',
					})
					break

				case 401:
					// error.message = '未授权，请重新登录(401)';
					router.push({
						name: 'error_401',
					})
					break

				case 403:
					// error.message= '拒绝访问(403)';
					router.push({
						name: 'error_403',
					})
					break

				case 404:
					// error.message= '请求出错(404)';
					router.push({
						name: 'error_404',
					})
					break

				case 408:
					// error.message= '请求超时(408)';
					router.push({
						name: 'error_408',
					})
					break

				case 500:
					// // error.message= '服务器错误(500)';
					router.push({
						name: 'error_500',
					})
					break

				case 501:
					// error.message= '服务未实现(501)';
					router.push({
						name: 'error_501',
					})
					break

				case 502:
					// error.message= '网络错误(502)';
					router.push({
						name: 'error_502',
					})

					break

				case 503:
					// error.message= '服务不可用(503)';
					router.push({
						name: 'error_503',
					})
					break

				case 504:
					// error.message= '网络超时(504)';
					router.push({
						name: 'error_504',
					})
					break

				case 505:
					// error.message= 'HTTP版本不受支持(505)';
					router.push({
						name: 'error_505',
					})
					break

				default:
					error.message = `连接出错(${error.response.status})!`
			}
		} else {
			ElMessage.closeAll()
			ElMessage({
				message: error.message,
				type: 'error',
				duration: 6 * 1000,
			})
		}
		return Promise.reject(error)
	}
)

export default service
