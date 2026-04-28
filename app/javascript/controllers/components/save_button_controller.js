import { Controller } from "@hotwired/stimulus";
import ajax from "../../utils/ajax";
import toast from "../../components/toast";

export default class extends Controller {
	static values = { isLiked: Boolean }
	#isSaving = false

	initialize() {
		this.element.addEventListener('click', () => this.#saveBook())
	}

	connect() {
		this.bookId = this.element.dataset.bookId

		this.#update()
	}

	isLikedValueChanged() {
		this.#update()
	}
	
	/**
	 * Updating the UI state
	 */
	#update() {
		const icons = document.querySelectorAll('.save-btn .icon')
		const labels = document.querySelectorAll('.save-btn .label')

		if (this.isLikedValue) {
			icons.forEach(icon => icon.classList.add('ph-fill', 'text-red-600'))
			icons.forEach(icon => icon.classList.remove('ph', 'text-secondary'))
			labels.forEach(label => label.innerText = 'Saved')
		} else {
			icons.forEach(icon => icon.classList.remove('ph-fill', 'text-red-600'))
			icons.forEach(icon => icon.classList.add('ph', 'text-secondary'))
			labels.forEach(label => label.innerText = 'Save')
		}
	}

	async #saveBook() {
		if (this.#isSaving) return

		this.#isSaving = true
		this.isLikedValue = !this.isLikedValue
		
		try {
			await ajax({
				url: '/api/v1/users/books/save',
				method: 'POST',
				skipAutoErrorRender: true,
				data: {
					book_id: this.bookId
				},
				success: (res) => {
					this.isLikedValue = res.saved
					toast({ message: res.saved ? "Book saved" : "Book is no longer saved" })
				},
				error: (res) => {
					toast({ message: res.data.error || 'Something went wrong. Try again soon.', type: 'error' })
					this.isLikedValue = !this.isLikedValue
				},
			})
		} catch (error) {
			toast({ message: 'Something went wrong. Try again soon.', type: 'error' })
			this.isLikedValue = !this.isLikedValue
		}

		this.#isSaving = false
	}
}