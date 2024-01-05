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
	},
})
