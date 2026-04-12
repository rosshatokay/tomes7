import { Controller } from "@hotwired/stimulus";
import { Turbo } from "@hotwired/turbo-rails";

export default class extends Controller {
	static targets = ['label', 'select']

	connect() {
		this.updateLabel()
		this.bindThemeSelector()		
		this.element.querySelector('select').addEventListener('change', (e) => this.updateLabel())
	}

	bindThemeSelector() {
		const stElm = this.element.querySelector('#select-theme')
		if (!stElm) return

		stElm.value = Theme.getTheme()
		this.updateLabel()
		
		stElm.addEventListener('change', () => {
			Theme.setTheme(stElm.options[stElm.selectedIndex].value)
		})
	}

	updateUrlParams(event) {
		const value = event.target.value
		const paramName = event.currentTarget.dataset.param
		const url = new URL(window.location.href)

		if (value) {
			url.searchParams.set(paramName, value)
		} else {
			url.searchParams.delete(paramName)
		}

		url.searchParams.delete('page')

		window.location.assign(url.toString())
	}

	updateLabel() {
		const select = this.element.querySelector('select')
		if (select && this.hasLabelTarget) {
			this.labelTarget.innerText = select.options[select.selectedIndex].text
		}
	}
}