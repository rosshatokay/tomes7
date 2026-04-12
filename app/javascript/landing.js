import gsap from "gsap";
import hideSplitElms from "./utils/hideSplitElms";

function animateLandingPage() {
	gsap.registerPlugin(SplitText)

	const tl = gsap.timeline()
	const titleSplit = SplitText.create('#splash-h1', { type: "lines" })
	const subtitleSplit = SplitText.create('#splash-p', { type: "lines" })
	const textContainer = document.getElementById('splash-text-container')
	const textContainerHeight = textContainer.clientHeight
	const docHeight = document.body.clientHeight
	/**
	 * @type {gsap.TweenVars}
	 */
	const imageOpts = { duration: 1.5, yPercent: 12, opacity: 0, ease: "expo.out", scale: 0.9, transformOrigin: 'top center' }

	titleSplit.lines.forEach(line => hideSplitElms(line, 'inline-block'))
	subtitleSplit.lines.forEach(line => hideSplitElms(line, 'inline-block'))

	tl.from(titleSplit.lines, {
		duration: 1,
		yPercent: 110,
		stagger: 0.1,
		ease: "expo.out",
		force3D: false,
	}).from(subtitleSplit.lines, {
		duration: 1,
		yPercent: 110,
		stagger: 0.05,
		ease: "expo.out",
		force3D: false,
	}, '-=0.7').from('#splash-search-bar', {
		duration: 1,
		yPercent: 48,
		opacity: 0,
		ease: "expo.out"
	}, '-=0.7').from('#splash-text-container', {
		y: ((docHeight / 2) - textContainerHeight) - 64,
		duration: 2,
		ease: "expo.inOut"
	}, '-=1.5').from('.splash-g-1', imageOpts, '-=0.9')
		.from('.splash-g-2', imageOpts, '-=1.4')
		.from('.splash-g-3', imageOpts, '-=1.3')
		.from('.splash-g-4', imageOpts, '-=1.4').play()
}

document.addEventListener('turbo:load', () => {
	const sceneWrapper = document.querySelector('.landing-scene')
	if (!sceneWrapper) return
	
	requestAnimationFrame(() => {
		sceneWrapper.classList.remove('opacity-0')
		animateLandingPage()
	})
})