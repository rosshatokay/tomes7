/**
 * Carousel Scroller plugin
 * @param {HTMLElement} container - Container to apply carousel to
 */
const CarouselScroller = (container) => {
	const carousel = container
	const isRTL = document.documentElement.dir == 'rtl'
	const STEP = 300
	const SCROLL_DELAY = 350
	// simple debounce helper
	const debounce = (fn, delay) => {
		let inProgress = false
		return (...args) => {
			if (inProgress) return
			inProgress = true
			fn(...args)
			setTimeout(() => inProgress = false, delay)
		}
	}


	// Normalizes scrollLeft so 0 = start, max = end
	function getNormalizedScrollLeft(element) {
		const dir = getComputedStyle(element).direction
		if (dir !== 'rtl') return element.scrollLeft

		// RTL
		const scrollLeft = element.scrollLeft
		const max = element.scrollWidth - element.clientWidth

		// Detect browser mode
		if (scrollLeft > 0) {
			// Firefox "reverse" mode
			return max - scrollLeft
		} else {
			// Chrome/Safari "negative" mode
			return -scrollLeft
		}
	}

	function clamp(v, min, max) {
		return Math.max(min, Math.min(max, v))
	}

	function scrollCarousel(direction) {
		// const carousel = document.querySelector('.study-fields-carousel')
		const max = carousel.scrollWidth - carousel.clientWidth
		const dir = getComputedStyle(carousel).direction

		// Flip direction in RTL so "next" moves visually forward
		let delta = direction === 'next' ? STEP : -STEP
		if (dir === 'rtl') delta = -delta

		const current = getNormalizedScrollLeft(carousel)
		const targetNormalized = clamp(current + delta, 0, max)

		// Convert normalized target back to browser's native scrollLeft for RTL
		let targetNative
		if (dir !== 'rtl') {
			targetNative = targetNormalized
		} else {
			const test = carousel.scrollLeft
			if (test > 0) {
				// Firefox reverse mode
				targetNative = max - targetNormalized
			} else {
				// Chrome/Safari negative mode
				targetNative = -targetNormalized
			}
		}
		
		carousel.scrollTo({
			left: targetNative,
			behavior: 'smooth'
		})
	}

	const next = debounce(() => scrollCarousel(!isRTL ? 'next' : 'prev'), SCROLL_DELAY)
	const prev = debounce(() => scrollCarousel(!isRTL ? 'prev' : 'next'), SCROLL_DELAY)

	return { next, prev }
}

export default CarouselScroller