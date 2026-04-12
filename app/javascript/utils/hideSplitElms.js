const hideSplitElms = (elm, display) => {
	let wrapper = document.createElement("div")
	wrapper.classList.add('mask', '-my-2', 'py-2')
	wrapper.style.overflow = "hidden"
	wrapper.style.display = display

	elm.parentNode.insertBefore(wrapper, elm)
	wrapper.appendChild(elm)
}

export default hideSplitElms