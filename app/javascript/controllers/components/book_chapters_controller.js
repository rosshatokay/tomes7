import { Controller } from "@hotwired/stimulus";
import ajax from "../../utils/ajax";
import van from "vanjs-core";
import emptyState from "../../components/emptyState";
import loadableButton from "../../components/loadableButton";
import toast from "../../components/toast";
import tabled from "../../components/tabled";

/**
 * @typedef {object} TocItem
 * @property {string} title
 */

const { div, button } = van.tags

export default class extends Controller {
	#data = {}
	#bookId = this.element.dataset.bookId
	#isGenerating = van.state(false)
	#emptyTocState = emptyState({
		title: "Missing table of contents",
		description: "You haven't generated the table of contents for this book.",
		cta: {
			custom: () => loadableButton({
				type: "button",
				class: 'btn btn-primary h-9',
				onclick: () => this.#generateToc()
			}, {
				isLoading: this.#isGenerating.val,
				spinnerClasses: 'w-4 h-4 !border-2 opacity-50',
			}, 'Generate')
		}
	})

	initialize() {
		this.#getToc()
	}

	/**
	 * Render toc table
	 * @param {TocItem[]} data - table of content items
	 */
	#renderToc(data) {
		const tocTable = tabled(['#', 'Chapter'])
		
		van.add(this.element, div({class: 'font-semibold text-xl mb-6'}, 'Table of contents'))
		van.add(this.element, tocTable.table)

		data.forEach((tci, i) => {
			const tds = [i + 1, div(tci.title)]
			
			tocTable.addRow(tds)
		})

		this.#emptyTocState.remove()
	}
	
	#generateToc() {
		this.#isGenerating.val = true

		ajax({
			url: '/api/v1/books/generate-toc',
			skipAutoErrorRender: true,
			method: 'POST',
			data: {
				book_id: this.#bookId
			},
			success: (data) => {
				this.#renderToc(data)
				this.#isGenerating.val = false
			},
			error: (res) => {
				toast({ message: "Something went wrong.", type: "error" })
				console.error(res)
				this.#isGenerating.val = false
			}
		})
	}

	#getToc() {
		ajax({
			url: '/api/v1/books/toc',
			data: {
				book_id: this.#bookId
			},
			success: (res) => {
				if (!res.generated) {
					this.#renderEmptyState()
					return
				}

				this.#renderToc(res.toc)
			}
		})
	}

	#renderEmptyState() {
		van.add(
			this.element,
			this.#emptyTocState
		)
	}
}