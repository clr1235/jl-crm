import { defineStore } from 'pinia'

import { getContractDialog, getExportNumbers } from '@/utils/auth'

export const useMenuStore = defineStore('menu', {
	state: () => {
		return {
			navTree: [], // 导航菜单树
			menuName: '', //更新系统管理下的菜单名称--详细请看bug 5976
			ActiveAppMain: null, //激活AppMain模块 但是用的是时间戳 嘿嘿嘿~
			isShowContractDialog: getContractDialog(), //用于获取弹框显隐(登录完成后显示一次，后期可能会改)
			taskNumber: getExportNumbers() || 0, //任务数量(需要动态的修改)
			unreadNum: 0, //先0吧
			isShowUrlParams: false, //是否展示url上的参数 false为不展示
		}
	},
	actions: {},
})
