// import TippyHandler from "../utils/tippyHandler";

import tippy from "tippy.js";

/**
 * @param {HTMLElement} element - Element
 * @param {object} options - Popup options
 * @param {boolean} options.preventUnmount - Should popup remain in DOM after closing?
 */
function Popup(element, options = {}) {
	tippy(element, {
		trigger: 'click',
		appendTo: () => document.body,
		animation: true,
		placement: 'bottom-end',
		interactive: true,
		popperOptions: {
			modifiers: [
				{
					name: 'preventOverflow',
					options: {
						padding: 24
					}
				},
				{
					name: 'flip',
					options: {
						fallbackPlacements: ['top', 'right', 'left', 'bottom-end', 'bottom-start'],
					},
				},
			]
		},
		onHide(instance) {
			instance.popper.querySelector('.context').setAttribute('data-state', 'hidden')

			setTimeout(() => {
				if (options.preventUnmount != true) {
					requestAnimationFrame(instance.unmount)
				}
			}, 150);
		},
		onMount(instance) {
			instance.popper.querySelector('.context').setAttribute('data-state', 'visible')
		},
		render() {
			const popper = document.createElement('div')
			const contextHTML = element.querySelector('.context')

			if (!contextHTML) throw new Error('Context missing for dropdown')

			contextHTML.setAttribute('data-state', 'hidden')
			popper.appendChild(contextHTML)

			return { popper }
		}
	})
}

export default Popup