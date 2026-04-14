// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"

import TippyHandler from "./components/tippyHandler"
import MicroModal from "micromodal"
import CarouselScroller from "./utils/carouselScroller"
import Popup from "./components/popup"
import copyToClipboard from "./utils/copyToClipboard"
import toast from "./components/toast"
import { hideAll } from "tippy.js"

function bindCarousels() {
	const carousels = document.querySelectorAll('.varousel-container')

	carousels?.forEach(car => {
		const carousel = car.querySelector('.varousel')
		const scroller = CarouselScroller(carousel)
		const nextBtn = car.querySelector('.varousel-next')
		const prevBtn = car.querySelector('.varousel-prev')

		nextBtn?.addEventListener('click', () => scroller.next())
		prevBtn?.addEventListener('click', () => scroller.prev())
	})
}

function smoothScrollSnap() {
	document.querySelectorAll('a[href^="#"]').forEach(link => {
		link.addEventListener('click', e => {
			e.preventDefault(); // stop reload
			const target = document.querySelector(link.getAttribute('href'));
			if (target) target.scrollIntoView({ behavior: 'smooth' });
		});
	})
}

function bindMenus() {
	const menus = document.querySelectorAll('.action-menu')

	menus.forEach(m => (typeof m._tippy == 'undefined') ? Popup(m) : null)
}

function bindCopyInviteLinkBtn() {
	const btn = document.getElementById('link-btn')

	btn?.addEventListener('click', (e) => {
		copyToClipboard(e.target.dataset.link)
		MicroModal.close('invite-modal')
		toast({ message: 'Link copied', type: 'success' })
	})
}

function bindShareTriggerBtns() {
	const btns = document.querySelectorAll('button[data-share-trigger]')
	btns.forEach(btn => btn.addEventListener('click', () => share(btn.dataset)))

	async function share(dataset) {
		let shareData = {}

		dataset.shareTitle ? shareData.title = dataset.shareTitle : null
		dataset.shareDescription ? shareData.description = dataset.shareDescription : null
		dataset.shareUrl ? shareData.url = dataset.shareUrl : null

		if (!navigator.share) {
			copyToClipboard(url)
			toast({ message: "URL copied" })
			return
		}

		try {
			await navigator.share(shareData)
		} catch (error) {
			console.error('Error sharing content:', error)
		}
	}
}

document.addEventListener('turbo:load', () => {
	requestAnimationFrame(() => {
		TippyHandler.bind()
	})
	MicroModal.init({ disableScroll: true, disableFocus: true })
	bindCarousels()
	smoothScrollSnap()
	bindMenus()
	bindCopyInviteLinkBtn()
	bindShareTriggerBtns()
	bindTippyCloser()
})

function bindTippyCloser() {
	document.body.addEventListener('click', (e) => {
		if (e.target.dataset?.closePopup == 'true') {
			hideAll()
		}
	})
}

document.addEventListener("turbo:frame-load", (e) => {
	e.target.scrollIntoView({ behavior: "smooth" })
})