import { Controller } from "@hotwired/stimulus";
import Choices from "choices.js";
import ajax from "../../utils/ajax";
import _ from "lodash";
import ChoicesSearch from "../../components/choicesSearch";

class TagSearch extends ChoicesSearch {
	constructor(element) {
		super({element: element, endpoint: '/api/v1/tags', placeholder: 'Enter or search tags'})

		this.addChoices(prefillTags)
		this.on('search:success', (data) => this.addChoices(data))
	}

	addChoices(results) {
		const formatted = results.map(result => ({
			value: result.name,
			label: result.name,
			selected: result.selected || false
		}));

		// this.choices.clearChoices()
		this.choices.setChoices(formatted, 'value', 'label', false)
	}
}

export default class extends Controller {
	initialize() {
		new TagSearch(this.element)
	}
}