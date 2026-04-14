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
			instance.popper.querySelector('.context')?.setAttribute('data-state', 'hidden')
			instance.popper.querySelector('.sheet')?.setAttribute('data-state', 'hidden')
			instance.popper.classList.remove('shown')

			console.log(instance.reference.dataset);
			
			if (instance.reference.dataset.disableScroll == 'on') {
				document.body.style.overflow = 'auto'
			}
			
			setTimeout(() => {
				if (options.preventUnmount != true && !instance.popper.classList.contains('drawer')) {
					requestAnimationFrame(instance.unmount)
				}
			}, 150);
		},
		onShow(instance) {
			if (instance.reference.dataset.disableScroll == 'on') {
				document.body.style.overflow = 'hidden'
			}
		},
		onMount(instance) {
			instance.popper.classList.add('shown')
			instance.popper.querySelector('.context')?.setAttribute('data-state', 'visible')
			instance.popper.querySelector('.sheet')?.setAttribute('data-state', 'visible')
		},
		render() {
			const popper = document.createElement('div')
			const contextHTML = element.querySelector('.context') || element.querySelector('.sheet')

			if (element.classList.contains('is-sheet')) {
				popper.classList.add('drawer')
			}
			
			if (!contextHTML) throw new Error('Context missing for dropdown')

			contextHTML.setAttribute('data-state', 'hidden')
			popper.appendChild(contextHTML)

			return { popper }
		}
	})
}

export default Popup