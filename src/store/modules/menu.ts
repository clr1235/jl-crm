import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', {
	state: () => {
		return {
			collapsed: false,
		}
	},
	actions: {
		changeCollapsed() {
			this.collapsed = !this.collapsed
		},
	},
})
