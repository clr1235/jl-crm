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

// 获取验证图片  以及captchaToken
export function reqGet(data: any) {
	return request({
		url: '/crm/sys/getAjCaptcha',
		method: 'post',
		data,
	})
}

// 滑动或者点选验证
export function reqCheck(data: any) {
	return request({
		url: '/crm/sys/checkAjCaptcha',
		method: 'post',
		data,
	})
}

export function logout() {
	return request({
		url: '/crm/sys/logout',
		method: 'post',
	})
}
