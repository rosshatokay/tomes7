import { Controller } from "@hotwired/stimulus";
import van from "vanjs-core";
import loadableButton from "../components/loadableButton";
import toast from "../components/toast";
import MicroModal from "micromodal";
import ajax from "../utils/ajax";
import TippyHandler from "../components/tippyHandler";

const { div, i, a, img} = van.tags

class RatingModule {
	/**
	 * Rating while hovering
	 * @type {import("vanjs-core").State<number|undefined>}
	 */
	#tempRating = van.state(undefined)
	#inactiveClasses = 'text-secondary opacity-25'
	#activeClasses = 'text-amber-500'
	#rating = van.state(undefined)
	#isSubmitting = van.state(false)
	#reviewBody = van.state()

	constructor() {
		this.sliderContainers = document.querySelectorAll('.rating-slider-container')
		this.modal = document.getElementById('review-modal')
		this.bodyInput = this.modal.querySelector('textarea')
		this.reviewsContainer = document.querySelector('[data-reviews-container]')

		this.#renderElms()
		this.#bindListeners()
	}

	#bindListeners() {
		this.bodyInput.addEventListener('input', () => this.#reviewBody.val = this.bodyInput.value)

		document.addEventListener("turbo:submit-end", (event) => {
			if (event.detail.success) {
				MicroModal.close('review-modal')
				toast({ message: "Review added!", type: "success" })
			} else {
				toast({ message: "Something went wrong", type: "error" })
			}
		})

		document.addEventListener("turbo:frame-load", (e) => {
			if (e.target.id == 'reviews') {
				e.target.scrollIntoView({ behavior: "smooth" })
			}
		})
	}

	#onMouseMove(e) {
		if (typeof e.target.dataset.index != 'string') return
		this.#tempRating.val = e.target.dataset.index
	}

	#onMouseLeave() {
		this.#tempRating.val = this.#rating.val
	}

	#renderElms() {
		this.sliderContainers.forEach(container => {
			const slider = this.#createSlider()
			van.add(container, slider)
		})

		van.add(this.modal.querySelector('.s-modal--body'), () => this.#reviewBtn())
	}

	#reviewBtn() {
		return loadableButton({
			class: () => `btn h-11 ${this.#rating.val ? 'btn-primary' : 'btn-disabled'} mx-auto mt-6`,
			type: 'submit',
			onclick: () => {
				this.modal.querySelector('form').requestSubmit()
				this.#isSubmitting.val = true
			}
		}, {
			isLoading: this.#isSubmitting.val
		}, 'Add review')
	}

	/**
	 * On star click
	 * @param {Event} e 
	 */
	#onClick(e) {
		const rating = e.target.dataset.index
		this.#rating.val = rating
		this.modal.querySelector('form #rating_score').value = this.#rating.val
		// this.#tempRating.val = rating
	}

	#createSlider() {
		const stars = Array.from({ length: 5 }).map((_, index) =>
			i({
				class: () => `ph-fill ph-star ${index <= this.#tempRating.val - 1 ? this.#activeClasses : this.#inactiveClasses} text-2xl star cursor-pointer`,
				'data-index': index + 1
			})
		)

		return div({
			class: 'flex justify-center gap-1',
			onmousemove: (e) => this.#onMouseMove(e),
			onmouseleave: () => this.#onMouseLeave(),
			onclick: (e) => this.#onClick(e)
		},
			stars
		)
	}
}

/**
 * Reader data
 * @typedef {object} Reader
 * @property {string} username
 * @property {string} avatar
 * @property {string} permalink
 */

export default class extends Controller {
	static targets = ['readers']
	#bookId = location.href.split('/')[location.href.split('/').length - 1]
	/**
	 * @type {HTMLElement}
	 */
	#readersContainer = this.readersTarget
	#readersCountElm = document.getElementById('total-readers-count-badge')

	initialize() {
		new RatingModule()
	}

	connect() {
		this.addReaders()
	}

	/**
	 * Reader item
	 * @param {Reader} reader 
	 * @returns {HTMLElement}
	 */
	#reader(reader) {
		if (!reader) {
			return div({ class: 'bg-surface w-full aspect-square rounded-full is-skeleton' })
		}

		requestAnimationFrame(() => TippyHandler.bind())
		
		return a({ href: reader.permalink, class: 'w-full aspect-square rounded-full border-2 border-transparent hover:border-primary transition', 'data-tippy-content': reader.username },
			img({src: reader.avatar, class: 'w-full h-full object-cover rounded-full'})
		)
	}

	addReaders() {
		van.add(this.#readersContainer, Array.from({ length: 12 }).map(i => this.#reader()))

		setTimeout(() => {
			this.getReaders()
		}, 600);
	}

	/**
	 * Handle successful response from API to render readers list
	 * @param {object} res 
	 * @param {object} res.readers
	 * @param {number} res.readers.total_count
	 * @param {Reader[]} res.readers.collection
	 */
	#handleReadersRes(res) {
		const readers = res.readers
		this.#readersContainer.innerHTML = ''
		this.#readersCountElm.classList.remove('is-skeleton', 'h-5')
		this.#readersContainer.classList.remove('gap-2')
		this.#readersCountElm.textContent = readers.total_count
		
		if (readers.collection.length) {
			readers.collection.forEach(reader => van.add(this.#readersContainer, this.#reader(reader)))
		} else {
			this.#readersContainer.classList.remove('grid')
			van.add(this.#readersContainer, div({class: 'flex-center text-sm text-secondary p-4 rounded-lg w-full bg-surface'}, 'No readers yet'))
		}
	}

	getReaders() {
		ajax({
			skipAutoErrorRender: true,
			url: '/api/v1/users/books/readers',
			data: {
				book_id: this.#bookId
			},
			success: (res) => this.#handleReadersRes(res),
			error: (res) => console.log(res),
		})
	}
}