import { defineStore } from 'pinia'

import { constantRouterMap, asyncRouterMap } from '@/router'
import { getLimit, setLimit } from '@/utils/auth'
import { menuApi } from '@/api'
import { getColumSetting } from '@/utils/auth'

export const usePermissionstore = defineStore('permission', {
	state: () => {
		return {
			routers: constantRouterMap as any,
			addRouters: [],
			hasRouter: false, // 菜单和路由是否已经加载
			permissionListAll: [] as any[],
			columSettingResult: [] || getColumSetting(), //表头设置的数组
			keyArry: [],
		}
	},
	actions: {
		// 加载动态菜单和路由
		getRoutes() {
			return new Promise((resolve, reject) => {
				menuApi
					.findNavTree()
					.then((res) => {
						// console.log('重新请求路由数据')
						if (res.data.code === 0) {
							const resData = res.data.data
							// 保存加载状态
							this.hasRouter = true

							this.addRouters = resData
							this.routers = asyncRouterMap.concat(resData)

							setLimit(resData)
							// 获取权限
							const perList: any[] = []
							getPermissionList(resData, perList)
							const newPerList = rep(getPermissionList(resData, perList))
							this.permissionListAll = newPerList

							resolve('success')
						}
					})
					.catch((error) => {
						reject(error)
					})
			})
		},
		GenerateRoutes() {
			return new Promise(() => {
				return getLimit()
			})
		},
	},
})

function getPermissionList(oldArr: any, newArr?: any) {
	for (let i = 0; i < oldArr.length; i++) {
		const children = oldArr[i]
		newArr.push(...children.permission)
		if (children.children.length) {
			getPermissionList(children.children, newArr)
		}
	}
	return newArr
}
function rep(arr: any) {
	const ret = []
	for (let i = 0; i < arr.length; i++) {
		if (arr.indexOf(arr[i]) == i) {
			ret.push(arr[i])
		}
	}
	return ret
}
