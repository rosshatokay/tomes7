import { Controller } from "@hotwired/stimulus";
import van from "vanjs-core";
import loadableButton from "../../components/loadableButton";
import ajax from "../../utils/ajax";
import toast from "../../components/toast";
import MicroModal from "micromodal";

export default class extends Controller {
	#isLoading = van.state(false)

	connect() {
		this.footer = this.element.querySelector('.footer')

		this.addSubmitBtn()
	}

	async #submit() {
		if (!this.element.checkValidity() || this.#isLoading.val) return
		this.#isLoading.val = true
		
		try {
			await ajax({
				url: '/api/v1/feedbacks/request-book',
				method: 'POST',
				data: {
					book_title: this.element.querySelector('#book-title').value,
					author_name: this.element.querySelector('#author-name').value
				},
				skipAutoErrorRender: true,
				success: (res) => {
					this.element.reset()
					if (res.success) {
						toast({message: 'Your message has been sent'})
					} else {
						toast({message: res.message || 'An error occurred', type: 'warning'})
					}

					MicroModal.close('request-book-modal')
				},
				error: (res) => {
					if (res.data.errors) {
						res.data.errors.forEach(err => toast({message: err, type: 'error'}))
						return	
					}
					toast({message: 'Something went wrong. Try again soon.', type: 'error'})
				},
			})
		} catch(e) {}

		this.#isLoading.val = false
	}

	addSubmitBtn() {
		van.add(this.footer, () => loadableButton({class: 'btn btn-secondary h-11', type: 'submit', onclick: () => this.#submit()}, {isLoading: this.#isLoading.val}, 'Request book'))
	}
}