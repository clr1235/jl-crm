import request from '@/api/request'

// 查找导航菜单树
export function findNavTree() {
	return request({
		url: '/crm/sys/getUserFunctionList',
		method: 'get',
	})
}
