import { Controller } from "@hotwired/stimulus";
import van from "vanjs-core";
import loadableButton from "../components/loadableButton";
import toast from "../components/toast";
import MicroModal from "micromodal";

const { div, i } = van.tags

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

export default class extends Controller {
	initialize() {
		new RatingModule()
	}
}