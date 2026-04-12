import tippy from "tippy.js"

const TippyHandler = (() => {
	function bind()
	{
		document.querySelectorAll('[data-tippy-content]').forEach((item, i) => {
			if (item.getAttribute('data-tippy-content') == '') return
			if (item._tippy) return
			
			tippy(item, {
				offset: [0, 8],
				placement: item.getAttribute('placement') ? item.getAttribute('placement') : 'top',
				allowHTML: true,
				animation: true,
				arrow: '<div class="arrow"></div>',
				onHide(instance) {
					const tip = instance.popper.querySelector('.s-tooltip')
					
					tip.setAttribute('data-state', 'hidden')
	
					setTimeout(() => {
						requestAnimationFrame(instance.unmount)
					}, 150)
				},
				onShow(instance) {
					updateTippyTextContent(instance)
				},
				onMount(instance) {
					const tip = instance.popper.querySelector('.s-tooltip')
					
					tip.setAttribute('data-state', 'visible')
				},
				render(instance) {
					const popper = document.createElement('div')
					const box = document.createElement('div')
					appendContent(instance, popper, box)
	
					function onUpdate(prevProps, nextProps)
					{
						if (prevProps.content !== nextProps.content) {
							box.textContent = nextProps.content;
						}
					}
					
					return {
						popper,
						onUpdate
					}
				}
			})
		})
	}

	function appendContent(instance, popper, box)
	{
		const hasIcon = instance.reference.hasAttribute('data-tippy-icon')
		const iconData = instance.reference.getAttribute('data-tippy-icon')
		const textElement = document.createElement('span')

		box.className = 's-tooltip'
		textElement.classList.add('s-tooltip--text')
		box.append(textElement)
		box.setAttribute('data-state', 'hidden')
		
		popper.append(box)

		// If an icon content exists
		if (hasIcon)
		{
			let listOfIcons = iconData.split(',')
			let separator = document.createElement('span')
			separator.textContent = '•'
			separator.classList.add('s-tooltip--separator')
			box.append(separator)

			listOfIcons.forEach((icon) => {
				let iconEl = document.createElement('div')

				iconEl.classList.add('s-tooltip--icon')
				iconEl.innerHTML = icon

				box.append(iconEl)
			})
		}

	}

	function updateTippyTextContent(instance)
	{
		let text = instance.popper.querySelector('.s-tooltip--text')
		let content = instance.reference.getAttribute('data-tippy-content')

		text.innerHTML = content
	}

	return {
		bind
	}
})()

export default TippyHandler