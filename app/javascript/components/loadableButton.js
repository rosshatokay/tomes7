import van from "vanjs-core"

const { button, i, div } = van.tags

/**
 * Loadable button (animatable)
 * @param {object} data - Van element data
 * @param {HTMLElement} labels - Element's labels
 * @param {object} config
 * @param {boolean} config.isLoading - Element loading state
 * @param {string} config.spinnerClasses - Spinner size in tailwindcss w-px/h-px
 * @returns {HTMLElement}
 */
const loadableButton = (data, config, ...labels) => {
	const element = button(
		data,
		labels
	)

	if (config.isLoading) {
		element.classList.add('btn-disabled')

		element.prepend(div({ class: `loading-spinner ${config.spinnerClasses || 'w-4 h-4 !border-2'} border-[var(--color-on-background)] opacity-50` }))
	}

	return element
}

export default loadableButton