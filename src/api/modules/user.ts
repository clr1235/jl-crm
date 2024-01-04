import request from '../request'

export const login = (data: any) => {
	return request({
		url: '/crm/sys/login',
		method: 'post',
		data,
	})
}

// 获取登录秘钥
export function getLoginSecretKey() {
	return request({
		url: '/crm/sys/getLoginSecretKey',
		method: 'get',
	})
}

export function getCaptcha(captchaId: any) {
	return request({
		url: '/crm/sys/getCaptcha',
		method: 'get',
		params: { captchaId },
	})
}

/* 获取用户信息 */
export function getInfo() {
	return request({
		url: '/crm/sys/getCurrentUserInfo',
		method: 'get',
	})
}
// 获取后台信息
export function getCrmAppInfo() {
	return request({
		url: '/crm/crm/getCrmAppInfo',
		method: 'get',
	})
}
