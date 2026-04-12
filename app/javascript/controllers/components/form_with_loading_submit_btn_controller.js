import { Controller } from "@hotwired/stimulus";
import van from "vanjs-core";
import loadableButton from "../../components/loadableButton";

const { div } = van.tags

export default class extends Controller {
	initialize() {
		this.isLoading = van.state(false)
		this.container = this.element.querySelector('.cta')
		this.submitBtn = loadableButton(
			{ class: 'btn btn-primary h-11', type: 'submit' },
			{
				isLoading: this.isLoading.val,
				spinnerClasses: ''
			}, 'Save book'
		)
	}

	connect() {
		const btn = this.container.querySelector('button')
		btn.remove()

		this.container.prepend(div(() => loadableButton(
			{ class: btn.classList, type: 'submit' },
			{
				isLoading: this.isLoading.val,
			}, btn.innerHTML
		)))

		this.element.addEventListener('submit', () => this.isLoading.val = true)
		this.element.addEventListener('turbo:submit-start', () => this.isLoading.val = true)
		this.element.addEventListener('turbo:submit-end', () => this.isLoading.val = false)
	}
}