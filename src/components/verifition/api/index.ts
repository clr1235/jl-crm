/**
 * 此处可直接引用自己项目封装好的 axios 配合后端联调
 */

import request from '@/api/request'

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
