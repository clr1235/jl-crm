import Cookies from 'js-cookie'

const userKey = 'userName'
const roleKey = 'role'
const ssidKey = 'ssid'
const TokenKey = 'key'
const LimitKey = 'all-Limits'
const expireTime = 'expire'
const auditStatus = 'auditStatus'
const checkedUserName = 'checkedUserName'
const LoginUserName = 'LoginUserName'
const ContractDialog = 'ContractDialog' //控制首页弹框显隐
const ExportNumbers = 'ExportNumbers'
const HostPathKey = 'HostPath'
const columSettingResultKey = 'columSettingResultNew'
const systemInfo = 'systemInfo'

export function setSystemInfo(key: any) {
	return Cookies.set(systemInfo, key)
}

export function getSystemInfo() {
	return Cookies.get(systemInfo)
}

export function setAuditStatus(key: any) {
	return Cookies.set(auditStatus, key)
}

export function getAuditStatus() {
	return Cookies.get(auditStatus)
}

export function setUserName(key: any) {
	return Cookies.set(userKey, key)
}

export function getUserName() {
	return Cookies.get(userKey)
}

export function setROLE(key: any) {
	return Cookies.set(roleKey, key)
}

export function getROLE() {
	return Cookies.get(roleKey)
}

export function setSSID(key: any) {
	return Cookies.set(ssidKey, key)
}

export function getSSID() {
	return Cookies.get(ssidKey)
}

export function getToken() {
	return Cookies.get(TokenKey)
}

export function getExpireTime() {
	return Cookies.get(expireTime)
}

export function setToken(key: any) {
	return Cookies.set(TokenKey, key)
}

export function removeToken() {
	return Cookies.remove(TokenKey)
}
// 首页合同弹框显隐
export function setContractDialog(key: any) {
	return Cookies.set(ContractDialog, key)
}
export function getContractDialog() {
	return Cookies.get(ContractDialog)
}
export function removeContractDialog() {
	return Cookies.remove(ContractDialog)
}
// 首页合同弹框显隐
// 任务管理中导出任务未完成的数量
export function setExportNumbers(key: any) {
	return Cookies.set(ExportNumbers, key)
}
export function getExportNumbers() {
	return Cookies.get(ExportNumbers)
}
export function removeExportNumbers() {
	return Cookies.remove(ExportNumbers)
}
// 任务管理中导出任务未完成的数量
export function getLimit() {
	return Cookies.get(LimitKey)
}

export function setLimit(limit: any) {
	return Cookies.set(LimitKey, limit)
}

export function removeLimit() {
	return Cookies.remove(LimitKey)
}

export function setExpireTime(expired: any) {
	return Cookies.set(expireTime, expired)
}

export function getUserChecked() {
	return Cookies.get(checkedUserName)
}

export function setUserChecked(key: any) {
	return Cookies.set(checkedUserName, key, { expires: 7, path: '' })
}

export function removeUserChecked() {
	return Cookies.remove(checkedUserName)
}

export function getLoginUserName() {
	return Cookies.get(LoginUserName)
}

export function setLoginUserName(key: any) {
	return Cookies.set(LoginUserName, key, { expires: 7, path: '' })
}

export function removeLoginUserName() {
	return Cookies.remove(LoginUserName)
}
// 缓存绥德域名
export function getHostPath() {
	return Cookies.get(HostPathKey)
}

export function setHostPath(key: any) {
	return Cookies.set(HostPathKey, key)
}

export function removeHostPath() {
	return Cookies.remove(HostPathKey)
}

// 动态设置里存储cookie
export function setColumSetting(key: any) {
	return Cookies.set(columSettingResultKey, key)
}
export function getColumSetting() {
	return Cookies.get(columSettingResultKey)
}

export function removeColumSetting() {
	return Cookies.remove(columSettingResultKey)
}
