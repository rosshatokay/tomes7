// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"

import TippyHandler from "./components/tippyHandler"
import MicroModal from "micromodal"
import CarouselScroller from "./utils/carouselScroller"
import Popup from "./components/popup"
import copyToClipboard from "./utils/copyToClipboard"
import toast from "./components/toast"

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

document.addEventListener('turbo:load', () => {
	requestAnimationFrame(() => {
		TippyHandler.bind()
	})
	MicroModal.init({ disableScroll: true })
	bindCarousels()
	smoothScrollSnap()
	bindMenus()
	bindCopyInviteLinkBtn()
})

document.addEventListener("turbo:frame-load", (e) => {
	console.log(e.target);
	
	// if (e.target.id == 'reviews') {
		e.target.scrollIntoView({ behavior: "smooth" })
	// }
})