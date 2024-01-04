import { defineStore } from 'pinia'

import { userApi } from '@/api'

export const useUserStore = defineStore('user', {
	state: () => {
		return {
			ssid: '',
		}
	},
	actions: {
		async login(fetchData: any) {
			const res = await userApi.login(fetchData)
			console.log(res, 'res=s=s=s=')
		},
	},
})
