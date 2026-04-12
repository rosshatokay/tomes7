/**
 * Pretty bytes format 
 * @param {number} bytes - Number of bytes
 * @param {number} decimals - Decimal rounding
 * @returns {string}
 */
const formatBytes = (bytes, decimals = 2) => {
	if (bytes == 0) return '0 Bytes'

	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export default formatBytes