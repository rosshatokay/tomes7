import { Controller } from "@hotwired/stimulus";
import ChoicesSearch from "../choicesSearch";

class Search extends ChoicesSearch {
	constructor(element) {
		super({
			element: element,
			endpoint: '/api/v1/authors/search',
			placeholder: "Search authors"
		})

		this.addChoices(prefillAuthors)
		this.on('search:success', (data) => this.addChoices(data))
	}

	/**
	 * 
	 * @param {AuthorResult[]} data 
	 */
	addChoices(results) {
		const formatted = results.map(result => ({
			value: result.id,
			label: this.#choiceHTML(result),
			selected: result.selected | false
		}));

		this.choices.clearChoices()
		this.choices.setChoices(formatted, 'value', 'label', false)
	}

	/**
	 * @param {AuthorResult} author 
	 * @returns {string} - HTML string
	 */
	#choiceHTML(author) {
		return /*html*/`<div class="flex items-center gap-2">
			<div class="font-medium text-[15px]">${author.full_name}</div>
		</div>`
	}
}

export default class extends Controller {
	initialize() {
		new Search(this.element)
	}
}