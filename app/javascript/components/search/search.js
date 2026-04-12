import _ from "lodash"
import van from "vanjs-core"
import ajax from "../../utils/ajax"

/**
 * @typedef {object} SearchConfig
 * @property {HTMLInputElement} inputElm
 * @property {HTMLElement} inputContainerElm
 * @property {string} endpoint - API endpoint
 */

const { div } = van.tags

export default class Search {
	#results = van.state()
	#hiddenResultsBoxClasslist = 'scale-[0.99] opacity-0 pointer-events-none'

	/**
	 * Is the ajax request loading?
	 * @type {import("vanjs-core").State<boolean>}
	 */
	isLoadingResults = van.state(false)

	/**
	 * @param {SearchConfig} config
	 */
	constructor(config) {
		this.config = config
		this.isFocused = van.state(false)
		this.input = this.config.inputElm
		this.listeners = {}
		this.resultsBoxWrapper = this.#getResultsBoxWrapper()

		if (!this.input) return
		this.#bindListeners()
	}

	/**
	 * Events listener
	 * @param {'search:success'|'search:empty'|'search:loading'} event 
	 * @param {Function} callback 
	 */
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

	/**
	 * Handle input query
	 * @param {string} q - Search query
	 */
	query(q) {
		if (q.length > 2) {
			// this.#renderResultsBox()
			this.#search(q)
		} else {
			this.removeResultsBox()
		}
	}

	#renderResultsBox() {
		this.resultsBoxWrapper.remove()

		van.add(this.config.inputContainerElm, this.resultsBoxWrapper)

		requestAnimationFrame(() => {
			this.resultsBoxWrapper.classList.remove(...this.#hiddenResultsBoxClasslist.split(' '))
		})
	}

	#handleDocClick(e) {
		const shouldClose = !(e.target == this.input || e.target.closest('.search-results-box'))

		if (shouldClose) {
			this.resultsBoxWrapper.classList.add(...this.#hiddenResultsBoxClasslist.split(' '))
			setTimeout(() => {

				this.isFocused.val = false
			}, 300);
		} else {
			this.resultsBoxWrapper.classList.remove(...this.#hiddenResultsBoxClasslist.split(' '))
		}
	}

	#bindListeners() {
		this.input.addEventListener('input', _.debounce((e) => this.query(e.target.value), 300))

		this.input.addEventListener('focus', () => {
			if (document.body.clientWidth >= 768) return
			this.isFocused.val = true
		})

		this.input.addEventListener('blur', (e) => {
			if (document.body.clientWidth >= 768) return
		})

		this.on('search:empty', () => {
			this.resultsBoxWrapper.innerHTML = ''
			van.add(this.resultsBoxWrapper, div({ class: 'p-4 text-center text-sm text-secondary font-medium' },
				div('No results found.'),
				div('Try a different keyword.'),
			))
		})

		document.addEventListener('click', (e) => this.#handleDocClick(e))
	}

	/**
	 * Results box wrapper
	 * @returns {HTMLElement}
	 */
	#getResultsBoxWrapper() {
		const wrapperElm = div({ class: 'search-results-box z-[2] shadow-xl border border-outline absolute scale-[0.99] transition top-full mt-2 left-0 p-2 w-full rounded-xl bg-white dark:bg-[#333] max-h-[500px] overflow-y-auto' },
			() => this.isLoadingResults.val ? '' : undefined
		)

		van.derive(() => {
			if (this.#results.val) {
				wrapperElm.innerHTML = ''
			}
		})

		return wrapperElm
	}

	#handleSuccess(res) {
		this.isLoadingResults.val = false
		this.#renderResultsBox()
	
		if (typeof res == 'object' && res instanceof Array && !res.length) {
			this.emit('search:empty')
			return
		}
	
		this.emit('search:success', res)
	}
	
	#search(q) {
		this.emit('search:loading')
		this.isLoadingResults.val = true

		ajax({
			url: this.config.endpoint,
			method: 'get',
			skipAutoErrorRender: true,
			data: {
				q: q
			},
			success: (res) => this.#handleSuccess(res),
			error: (res) => {
				console.error(res)
				this.isLoadingResults.val = false
			}
		})
	}

	removeResultsBox() {
		requestAnimationFrame(() =>
			this.resultsBoxWrapper.classList.add(...this.#hiddenResultsBoxClasslist.split(' '))
		)

		setTimeout(() => {
			// this.isFocused.val = false
			this.resultsBoxWrapper.remove()
		}, 300);
	}
}