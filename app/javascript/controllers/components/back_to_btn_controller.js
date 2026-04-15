import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
	connect() {
		this.element.addEventListener('click', () => window.history.back())
	}
}