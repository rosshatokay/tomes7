import van from "vanjs-core"
import { addCustomFont, addStyleToReader } from "./utils/utils"
import _ from "lodash"
import ajax from "./utils/ajax"
import MicroModal from "micromodal"

const { div, button, span } = van.tags

class Reader {
	/**
	 * @type {import("vanjs-core").State<boolean>}
	 */
	#locationsLoaded = van.state(false)
	#currentPercent = van.state()
	#book
	#rendition
	#elms = {
		topNav: document.getElementById('top-nav'),
		chapterLabel: document.querySelectorAll('.chapter-label'),
		pagesLeftLabel: document.getElementById('pages-left-label'),
		spinner: document.getElementById('spinner'),
		progressIndicator: document.getElementById('progress-indicator'),
		prevPage: document.getElementById('prev-page'),
		nextPage: document.getElementById('next-page'),
	}
	#darkTheme = {
		body: {
			"font-family": "Crimson Text !important",
			"line-height": "1.35",
			"background": "#181819"
		},
	}
	#lightTheme = {
		body: {
			"font-family": "Crimson Text !important",
			"line-height": "1.35",
			"background": "#ffffff"
		},
	}
	#bookLocation
	#bookSlug = document.querySelector('[data-slug]').dataset.slug
	#bookId = document.querySelector('[data-book-id]').dataset.bookId
	#epubEndpoint = `/books/${this.#bookSlug}/epub`
	#inactivityTimer
	#inactivityLimit = 3000
	#uiIsVisible = true

	constructor() {
		this.initialize()
	}

	async initialize() {
		await this.#getCurrentPosition()
		await this.getBook()
		this.#renderBook()
		this.chaptersMenu = new ChaptersMenu(this)
	}

	async #getCurrentPosition() {
		await ajax({
			url: '/api/v1/users/books/current-position',
			method: 'GET',
			data: {
				book_id: this.#bookId
			},
			success: (res) => this.#bookLocation = res.current_position
		})
	}

	// to correctly load the last saved location, we need this... otherwise it doesn't work
	async #renderBook() {
		if (this.#bookLocation) {
			await this.#rendition.display(this.#bookLocation)
			await this.#rendition.display(this.#bookLocation)
		} else {
			await this.#rendition.display()
		}
	}

	async getBook() {
		await fetch(this.#epubEndpoint) // Your existing Rails route
			.then(response => response.arrayBuffer())
			.then(data => {
				// Passing the buffer directly tells epub.js exactly what it's looking at
				this.#book = ePub(data)
				this.createReader()
				this.bindMouseListeners(document)
			})
	}

	goTo(href) {
		this.#rendition.display(href)
	}

	createReader() {
		this.#rendition = this.#book.renderTo('pages-area', {
			width: "100%",
			height: "100%",
			sandbox: "allow-same-origin allow-scripts",
			allowScriptedContent: true
		});

		this.registerHooks()
		this.registerThemes()
		this.bindDocListeners(document)
		this.bindControls()
		this.bindEvents()
		this.#book.loaded.navigation.then((nav) => {
			this.chaptersMenu.setTocByNav(nav)
			this.onRelocation(nav)
			this.getPercentage()
			this.showTutorialModal()
		})
		this.bindProgress()
	}

	showTutorialModal() {
		const markedAsComplete = localStorage.getItem('marked-nav-modal-complete')

		if (!markedAsComplete || markedAsComplete != 'true') {
			MicroModal.show('navigation-modal', {
				disableFocus: true,
				disableScroll: true,
				onClose: () => localStorage.setItem('marked-nav-modal-complete', true)
			})
		}
	}

	hideUI() {
		this.#elms.topNav.classList.add('opacity-0')
		this.#elms.pagesLeftLabel.classList.add('opacity-0')

		this.#uiIsVisible = false;
	}

	showUI() {
		this.#elms.topNav.classList.remove('opacity-0')
		this.#elms.pagesLeftLabel.classList.remove('opacity-0')

		this.#uiIsVisible = true;
	}

	bindMouseListeners(doc) {
		if (document.body.clientWidth > 640) {
			this.#inactivityTimer = setTimeout(() => this.hideUI(), this.#inactivityLimit);
		}

		doc.addEventListener('pointerdown', (e) => {
			if (e.pointerType === 'mouse') return

			if (!this.#uiIsVisible) {
				if (!this.#clickedOutsideReader(e)) return

				this.showUI()
			} else {
				if (this.#clickedOutsideReader(e)) return

				this.hideUI()
			}
		})

		doc.addEventListener('pointermove', (e) => {
			if (e.pointerType !== 'mouse') return

			if (!this.#uiIsVisible) {
				this.showUI();
			}

			clearTimeout(this.#inactivityTimer);
			this.#inactivityTimer = setTimeout(() => this.hideUI(), this.#inactivityLimit);
		});
	}

	bindProgress() {
		van.add(this.#elms.progressIndicator,
			() => this.#locationsLoaded.val ? div({ class: 'text-secondary text-sm px-2' }, () => `${this.#currentPercent.val}%`) : div({ class: 'loading-spinner w-4 h-4 !border-1' })
		)
	}

	/**
	 * Save percent locally and in db
	 * @param {number} percent - Float percent
	 * @param {string} cfi - Current book location (CFI)
	 */
	saveCurrentPosition(percent, cfi) {
		const whole = Math.ceil(percent * 100)

		this.#currentPercent.val = Math.ceil(whole)

		if (!cfi) return

		ajax({
			url: `/api/v1/users/books/${this.#bookId}/update-progress`,
			skipAutoErrorRender: true,
			method: 'PATCH',
			data: {
				progress: whole / 100,
				current_position: cfi
			},
			success: (res) => { },
			error: (res) => console.error(res)
		})
	}

	getPercentage() {
		this.#book.locations.generate(1600).finally(() => {
			const cfi = this.#rendition.currentLocation().end.cfi
			const percent = this.#book.locations.percentageFromCfi(cfi)
			this.#locationsLoaded.val = true
			this.saveCurrentPosition(percent, cfi)
		})
	}

	bindEvents() {
		this.#rendition.on('relocated', _.debounce((loc) => {
			const percent = this.#book.locations.percentageFromCfi(loc.end.cfi)

			this.saveCurrentPosition(percent, loc.end.cfi)
		}, 700))
	}

	bindControls() {
		this.#elms.prevPage.addEventListener('click', () => this.#rendition.prev())
		this.#elms.nextPage.addEventListener('click', () => this.#rendition.next())
	}

	updatePagination(loc) {
		const currPageInChap = loc.end.displayed.page
		const totalPagesInChap = loc.end.displayed.total
		const numOfPagesLeft = (totalPagesInChap - currPageInChap) + 1

		this.#elms.pagesLeftLabel.classList.toggle('opacity-0', totalPagesInChap <= 2)
		this.#elms.spinner.remove()

		if (numOfPagesLeft == 1) {
			this.#elms.pagesLeftLabel.textContent = `Last page in chapter`
		} else {
			this.#elms.pagesLeftLabel.textContent = `${numOfPagesLeft} pages left in chapter`
		}
	}

	onRelocation(nav) {
		this.#rendition.on('relocated', (loc) => {
			const href = loc.start.href
			const match = nav.toc.find(item => href.includes(item.href.split('#')[0]))

			if (match) {
				console.log(match.label);
				console.log(this.#elms.chapterLabel);
				
				this.#elms.chapterLabel.forEach(el => el.textContent = match.label)
			}

			this.updatePagination(loc)

			setTimeout(() => {
				document.getElementById('pages-area').classList.remove('opacity-0')
			}, 300);
		})
	}

	#clickedOutsideReader(e) {
		const hasNavId = e.target.getAttribute('id') == 'top-nav'
		const navClicked = e.target.closest('#top-nav')
		const menuClicked = e.target.closest('.context')

		return (hasNavId || navClicked || menuClicked) || false
	}

	/**
	 * @param {TouchEvent} e 
	 * @param {Document} doc
	 */
	#handleMobileNav(e, doc) {
		const touchXpos = e.changedTouches[0].screenX
		const pageWidth = doc.body.clientWidth
		const linkClicked = e.target.closest('a')
		
		if (this.#clickedOutsideReader(e) || linkClicked) return

		try {
			if (touchXpos >= pageWidth * 0.9) {
				this.#rendition.next()
			}
			if (touchXpos <= pageWidth * 0.4) {
				this.#rendition.prev()
			}
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * 
	 * @param {Document} doc - click event
	 */
	#handleMobileTaps(doc) {
		let startTime
		let isMoving = false

		doc.addEventListener('touchstart', (e) => {
			startTime = Date.now();
			isMoving = false; // Reset on every new touch
		}, { passive: true });

		doc.addEventListener('touchmove', () => {
			isMoving = true; // Movement invalidates a simple tap
		}, { passive: true });

		doc.addEventListener('touchend', (e) => {
			const duration = Date.now() - startTime;

			// Threshold: Only trigger if held for less than 500ms and no movement occurred
			if (!isMoving && duration < 500) {
				this.#handleMobileNav(e, doc)
			} else if (!isMoving && duration >= 500) {
				console.log('Hold ignored');
			}
		});
	}

	/**
	 * @param {HTMLDocument} doc - Pass which document to listen to
	 */
	bindDocListeners(doc) {
		const onKeyDown = (e) => {
			if (e.key === "ArrowRight") this.#rendition.next()
			if (e.key === "ArrowLeft") this.#rendition.prev()
		}

		this.#handleMobileTaps(doc)
		doc.addEventListener('keydown', onKeyDown)

		Theme.onThemeLoaded((e) => this.#rendition.themes.select(e.detail.theme))
	}

	registerHooks() {
		const content = this.#rendition.hooks.content

		content.register((contents) => {
			addCustomFont(contents)
			addStyleToReader(contents)
			this.bindDocListeners(contents.document)
			this.bindMouseListeners(contents.document)
		})
	}

	registerThemes() {
		const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

		this.#rendition.themes.register("dark", this.#darkTheme)
		this.#rendition.themes.register("light", this.#lightTheme)
		this.#rendition.themes.select(Theme.getTheme() == 'system' ? (isDarkMode ? 'dark' : 'light') : Theme.getTheme())
		this.#rendition.themes.fontSize("125%")
	}
}

class ChaptersMenu {
	/**
	 * @typedef {object} TocChapter
	 * @property {string} href
	 * @property {string} id
	 * @property {string} label
	 */

	/**
	 * @type {import("vanjs-core").State<TocChapter[]>}
	 */
	#chapters = van.state([])

	/**
	 * 
	 * @param {Reader} reader 
	 */
	constructor(reader) {
		/**
		 * @type {import("tippy.js").Instance}
		 */
		this.dropdown = document.getElementById('chapters')._tippy
		this.dropdown.setProps({
			onShow: () => { this.#renderChapters(this.dropdown.popper) }
		})
		this.reader = reader
	}

	setTocByNav(nav) {
		this.#chapters.val = nav.toc
	}

	/**
	 * Chapter button
	 * @param {TocChapter} chapter 
	 * @returns {HTMLButtonElement}
	 */
	#tocButton(chapter) {
		return button({
			class: 'btn btn-clear h-9 !p-2 !px-4 h-[initial] text-sm rounded-lg w-full justify-between',
			'data-close-popup': 'true',
			onclick: () => this.reader.goTo(chapter.href)
		},
			span({ class: 'whitespace-break-spaces text-left' }, chapter.label),
			// span({ class: 'text-secondary' }, '1')
		)
	}

	/**
	 * @type {import("tippy.js").PopperElement}
	 */
	#renderChapters(popper) {
		const context = popper.querySelector('.context')
		const wrapper = div(
			div({ class: 'p-2.5 px-4 border-b border-outline text-sm text-secondary' }, 'Chapters'),
			div({ class: 'flex flex-col p-1' },
				this.#chapters.val.map(c => {
					return this.#tocButton(c)
				})
			)
		)

		context.innerHTML = ''
		van.add(context, div(
			() => !this.#chapters.val.length
				? div({ class: 'flex-center text-sm text-secondary p-4 py-8' }, div({ class: 'loading-spinner w-6 h-6 border-2' }))
				: wrapper
		))
	}
}

document.addEventListener('DOMContentLoaded', () => new Reader())