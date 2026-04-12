import Choices from "choices.js"
import _ from "lodash"
import ajax from "../utils/ajax"

export default class ChoicesSearch {
	/**
	 * @param {object} config - Config
	 * @param {HTMLSelectElement} config.element 
	 * @param {string} config.endpoint - API endpoint to fetch autcomplete
	 * @param {string} config.placeholder - Input placeholder
	 */
	constructor(config) {
		this.listeners = {}
		this.config = config
		this.element = config.element
		this.endpoint = config.endpoint
		this.choices = new Choices(this.element, {
			removeItemButton: true,
			searchResultLimit: 10,
			searchPlaceholderValue: 'Search tags...',
			duplicateItemsAllowed: false,
			shouldSort: false,
			allowHTML: true,
			placeholderValue: config.placeholder,
			addChoices: true,
			addItemFilter: (value) => value.trim() !== ''
		})

		this.element.addEventListener('search', _.debounce((e) => this.query(e.detail.value), 300))
	}

	on(event, callback) {
		if (!this.listeners[event]) {
			this.listeners[event] = []
		}
		this.listeners[event].push(callback)
	}

	emit(event, data) {
		if (this.listeners[event]) {
			this.listeners[event].forEach(cb => cb(data))
		}
	}
	
	query(searchTerm) {
		if (searchTerm.length < 2) return

		ajax({
			skipAutoErrorRender: true,
			url: this.endpoint,
			method: 'GET',
			data: {
				q: searchTerm
			},
			success: (res) => this.emit('search:success', res),
			error: (res) => console.log(res),
		})
	}
}