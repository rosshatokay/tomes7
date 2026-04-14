import { Controller } from "@hotwired/stimulus";
import ajax from "../../utils/ajax";
import van from "vanjs-core";
import toast from "../../components/toast";

export default class extends Controller {
	initialize() {
		this.element.addEventListener('click', () => this.#saveBook())
	}

	connect() {
		this.isLiked = van.state(this.element.dataset.isLiked == 'true')
		this.bookId = this.element.dataset.bookId
		
		this.#update()
	}

	#update() {
		const icons = document.querySelectorAll('.save-btn .icon')
		const labels = document.querySelectorAll('.save-btn .label')
		
		van.derive(() => {
			if (this.isLiked.val) {
				icons.forEach(icon => icon.classList.add('ph-fill', 'text-red-600'))
				icons.forEach(icon => icon.classList.remove('ph', 'text-secondary'))
				labels.forEach(label => label.innerText = 'Saved')
			} else {
				icons.forEach(icon => icon.classList.remove('ph-fill', 'text-red-600'))
				icons.forEach(icon => icon.classList.add('ph', 'text-secondary'))
				labels.forEach(label => label.innerText = 'Save')
			}
		})
	}

	#saveBook() {
		ajax({
			url: '/api/v1/users/books/save',
			method: 'POST',
			skipAutoErrorRender: true,
			data: {
				book_id: this.bookId
			},
			success: (res) => {
				this.isLiked.val = res.saved
				toast({message: res.saved ? "Book saved" : "Book is no longer saved"})
			},
			error: (res) => {
				toast({message: res.data.error || 'Something went wrong. Try again soon.', type: 'error'})
			},
		})
	}
}