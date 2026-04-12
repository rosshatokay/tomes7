import Toastify from 'toastify-js'

/**
 * Toast
 * @param {object} config - Config options
 * @param {string} config.message - Message content
 * @param {'success'|'error'|'warning'} config.type - Message content
 */
const toast = ({message, type}) => {
	const getClassesByType = (type) => {
		switch (type) {
			case 'success':
				return '!bg-green-600 !text-white'
			case 'error':
				return '!bg-red-600 !text-white'
			case 'warning':
				return '!bg-amber-600 !text-white'
			default:
				return ''
		}
	}

	const formatMessageType = (message, type) => {
		let icon
		
		if (type == 'success') {
			icon = `<i class="-ml-1 ph ph-check-circle"></i>`
		}
		if (type == 'error') {
			icon = `<i class="-ml-1 ph ph-warning-circle"></i>`
		}
		if (type == 'warning') {
			icon = `<i class="-ml-1 ph ph-warning"></i>`
		}

		return icon + `<span>${message}</span>`
	}
	
	Toastify({
		escapeMarkup: false,
		text: type ? formatMessageType(message, type) : message,
		duration: 5000,
		gravity: 'bottom',
		className: `flex flex-center gap-2 ${getClassesByType(type)}`,
		stopOnFocus: true
	}).showToast()
}

export default toast