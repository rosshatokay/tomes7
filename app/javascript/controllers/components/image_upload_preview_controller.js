import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
	static targets = ['field', 'cover']
	
	connect() {
		this.fieldTarget.addEventListener('input', (e) => {
			const file = e.target.files[0]
			
			if (file) {
				const objUrl = URL.createObjectURL(file)

				this.coverTarget.setAttribute('style', `background: url(${objUrl}) center / cover;`)
				this.coverTarget.querySelectorAll('*').forEach(elm => elm.classList.add('opacity-0'))
			}
		})
	}
}