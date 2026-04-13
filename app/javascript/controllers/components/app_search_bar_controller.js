import { Controller } from "@hotwired/stimulus";
import Search from "../../components/search/search";
import van from "vanjs-core";

/**
 * @typedef {object} SearchResult
 * @property {object} book - Book
 * @property {string} book.cover - Book title
 * @property {string} book.author_names - Book's authors names
 * 
 * @property {object} author
 * @property {string} author.full_name - Author's full name
 * @property {string} author.avatar - Author's avatar URL
 * 
 * @property {object} category
 * @property {string} category.name - category's
 * @property {string} category.icon - category's icon emoji
 * 
 * @property {string} permalink
 * @property {'book'|'author'} type - Result type
 */

const { div, a, span } = van.tags

class AppSearchBar extends Search {
	/**
	 * @param {HTMLElement} container 
	 */
	constructor(container) {
		super({
			inputContainerElm: container,
			inputElm: container.querySelector('input'),
			endpoint: '/api/v1/search'
		})

		this.spinnerElm = container.querySelector('.loading-spinner')

		this.#bindAddBookBtn()
		this.#focusStateToggler()
		this.on('search:loading', () => this.spinnerElm.classList.remove('!hidden'))
		this.on('search:empty', () => this.spinnerElm.classList.add('!hidden'))
		this.on('search:success', (data) => {
			this.renderResults(data)
			this.spinnerElm.classList.add('!hidden')
		})
	}

	#focusStateToggler() {
		const isFocused = van.state(false)
		const secToHide = document.querySelectorAll('.on-focus-hide')
		const gridWrapper = document.querySelector('.nav-grid')
		
		this.config.inputElm.addEventListener('focus', () => isFocused.val = true)
		this.config.inputElm.addEventListener('blur', () => isFocused.val = false)

		van.derive(() => {
			if (isFocused.val) {
				secToHide.forEach(sec => sec.classList.add('hidden'))
				gridWrapper.classList.remove('md:grid-cols-[1fr_1.2fr_1fr]', 'grid-cols-[24px_1fr_24px]')
			} else {
				secToHide.forEach(sec => sec.classList.remove('hidden'))
				gridWrapper.classList.add('md:grid-cols-[1fr_1.2fr_1fr]', 'grid-cols-[24px_1fr_24px]')
			}
		})
	}
	
	#bindAddBookBtn() {
		const btn = document.getElementById('focus-search-bar-btn')

		btn?.addEventListener('click', () => this.input.focus())
	}

	/**
	 * Result item card
	 * @param {SearchResult} result 
	 * @returns {HTMLElement}
	 */
	resultItem(result) {
		const formatted = (type) => {
			switch (type) {
				case 'book':
					return {label: result.book?.author_names, html: div({ class: 'w-10 aspect-book rounded-sm', style: `background: url(${result.book.cover}) center / cover;` })}
				case 'author':
					return {label: 'Author', html: div({ class: 'w-10 aspect-square rounded-full', style: `background: url(${result.author.avatar}) center / cover;` })}
				case 'category':
					return {label: 'Category', html: div({ class: 'w-10 aspect-square rounded-full flex-center bg-surface' }, span(result.category.icon))}
				default:
					break;
			}
		}

		return div({ class: 'p-2 rounded-lg flex items-center hover:bg-surface gap-3 relative' },
			a({ href: result.permalink, class: 'absolute inset-0' }),
			formatted(result.type).html,
			div({ class: 'w-full' },
				div({ class: 'font-medium w-fit' }, result.book?.title || result.author?.full_name || result.category?.name),
				div({ class: 'text-secondary text-sm w-fit' }, formatted(result.type).label)
			)
		)
	}

	/**
	 * Render search results
	 * @param {SearchResult[]} results - Results array
	 */
	renderResults(results) {
		this.resultsBoxWrapper.innerHTML = ''

		results.forEach(result => {
			van.add(this.resultsBoxWrapper, this.resultItem(result))
		})
	}
}

export default class extends Controller {
	initialize() {
		new AppSearchBar(this.element, div('asd'))
	}
}