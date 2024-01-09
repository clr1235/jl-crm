//重置url地址栏
export function resetUrl() {
	let url = window.location.href
	const index = url.indexOf('?')
	index > 0 && (url = url.slice(0, index))
	window.history.replaceState(null, '', url)
}
