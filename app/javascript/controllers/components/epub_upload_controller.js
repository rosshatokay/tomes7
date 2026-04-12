import * as ActiveStorage from "@rails/activestorage"
import { Controller } from "@hotwired/stimulus";
import van from "vanjs-core";
import formatBytes from "../../utils/formatBytes";

const { div, i, button } = van.tags

export default class extends Controller {
	static targets = ['zone']

	#isUploading = van.state(false)
	#uploadPercent = van.state(0)

	initialize() {
		ActiveStorage.start()

		this.fileField = this.element.querySelector('input')
		this.fileField.addEventListener('input', (e) => this.handleFileSelect(e))

		document.addEventListener('direct-upload:start', (event) => {
			console.log(event.detail)
		})
		document.addEventListener('direct-upload:progress', (event) => {
			this.#uploadPercent.val = event.detail.progress
			console.log(event.detail)
		})
	}

	removeFileBtn() {
		return button({ class: 'btn btn-icon btn-clear w-8 text-sm', onclick: () => {} },
			i({ class: 'ph ph-trash' })
		)
	}

	epubUploadProgress() {
		return div({ class: 'flex items-center gap-2' },
			div({ class: 'w-20 h-2 mt-1 bg-surface dark:bg-white/20 rounded-[2px] overflow-hidden' },
				div({class: 'bg-blue-500 h-full transition transition-[width] duration-600', style: () => `width: ${this.#uploadPercent.val}%`})
			),
		)
	}

	handleFileSelect(e) {
		/**
		 * @type {File}
		 */
		const file = e.target.files[0]

		if (file.type != "application/epub+zip") {
			alert('Invalid file type')
			return
		}

		this.zoneTarget.classList.add('hidden')
		this.#isUploading.val = true

		van.add(this.element,
			div({ class: 'flex items-center justify-between w-full' },
				div({ class: 'flex items-center gap-3' },
					div({ class: 'flex-center w-12 aspect-square rounded-lg border border-outline' },
						i({ class: 'ph ph-file text-xl' })
					),
					div(
						div({ class: 'font-medium' }, file.name),
						div({ class: 'text-xs text-secondary' }, formatBytes(file.size))
					)
				),
				() => this.#isUploading.val ? this.epubUploadProgress() : this.removeFileBtn()
			)
		)
	}

	simulateUploadLifecycle(file) {
		const id = "fake-id"

		document.dispatchEvent(new CustomEvent('direct-upload:start', {
			detail: { id, file }
		}))

		let progress = 0

		const interval = setInterval(() => {
			progress += 10

			document.dispatchEvent(new CustomEvent('direct-upload:progress', {
				detail: { id, file, progress }
			}))

			if (progress >= 100) {
				clearInterval(interval)

				document.dispatchEvent(new CustomEvent('direct-upload:end', {
					detail: { id, file }
				}))
			}
		}, 200)
	}
}