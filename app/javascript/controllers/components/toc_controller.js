import { Controller } from "@hotwired/stimulus";
import van from "vanjs-core";

const { div } = van.tags

export default class extends Controller {
	initialize() {
		const rows = this.element.querySelectorAll('tbody tr')

		if (rows.length > 4) this.bindShowMore()
	}

	bindShowMore() {
		van.add(
			this.element,
			div({class: 'w-full h-[80%] absolute bottom-0 left-0 pointer-events-none bg-gradient-to-t from-[var(--color-background)] to-transparent'})
		)
	}
}