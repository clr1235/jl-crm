import { defineStore } from 'pinia'

import { userApi } from '@/api'

import { setToken, setContractDialog, setSSID, setExpireTime } from '@/utils/auth'

export const useUserStore = defineStore('user', {
	state: () => {
		return {
			ssid: '',
			key: '',
			expireTime: '',
		}
	},
	actions: {
		// 登录
		async login(fetchData: any) {
			const res = await userApi.login(fetchData)
			const { data, code } = res.data || {}
			if (code === 0) {
				setToken(data.key)
				setContractDialog(true)
				setSSID(data.ssid)
				setExpireTime(data.expired)
				// 保存key
				this.key = data.key
				this.ssid = data.ssid
				// 保存expire
				this.expireTime = data.expired
			}
			return res.data || {}
		},
		// 获取用户信息
		GetUserInfo() {
			return new Promise((resolve, reject) => {
				userApi
					.getInfo()
					.then((response) => {
						const data = response.data
						if (data.code === 0) {
							const res = data.data
							console.log(res, 'res=s=s=s=s=--------')
							// setUserName(res.userName)
							// setROLE(res.roleList)
							// commit('SET_USERINFO', res)
						}
						resolve(response)
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
	},
})
