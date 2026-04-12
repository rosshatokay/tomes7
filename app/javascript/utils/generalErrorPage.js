import van from "vanjs-core"

const { div, a } = van.tags

/**
 * @typedef {object} ContentResult
 * @property {string}	title				- Page error heading
 * @property {string}	description	- Short error description
 * @property {object}	button			- Reload/redirect button
 */

/**
 * Error screen
 * @param {number} statusCode - Server error status code
 * @returns {HTMLElement}
 */
const generalErrorPage = (statusCode) => {
	const logo = document.createElement('div')
	logo.innerHTML = icon_logo_svg
	logo.firstChild.style = 'width: 24px; height: 24px;'
	logo.querySelectorAll('path').forEach(item => item.style.fill = 'var(--color-on-background)')

	/**
	 * Get the error page's content by status code
	 * @returns {ContentResult}
	 */
	const contentByStatusCode = () => {
		const refreshButton = div({ class: 'btn btn-primary h-11 rounded-full', onclick: () => location.reload() }, 'Refresh')
		const backToRootButton = a({ href: '/', class: 'btn btn-primary h-11 rounded-full' }, 'Back to home')

		/**
		 * @type {ContentResult}
		 */
		let result = {
			title: 'Something went wrong',
			description: 'Oops, something went awry—try refreshing the page. If the problem persists, contact support.',
			button: refreshButton
		}

		switch (statusCode) {
			case 404:
				result.title = 'Oops! page not found'
				result.description = 'It looks like nothing was found at this location. Try going back to the homepage.'
				result.button = backToRootButton
				break
			case 401:
				result.description = 'You are not authorized to access this resource.'
				result.button = backToRootButton
				break
			case 403:
				result.description = 'Not found'
				result.button = backToRootButton
				break
		}

		return result
	}

	document.title = contentByStatusCode().title
	
	return div({ class: 'w-full h-full min-h-screen flex flex-center flex-col gap-3 px-6' },
		div({ class: 'fixed top-6 left-6 rtl:left-[initial] rtl:right-6' }, 
			a({href: '/'}, logo)
		),
		div({ class: 'flex flex-col gap-3 h-full flex-center text-center' },
			statusCode ? div({ class: 'text-fg-secondary bg-black/5 dark:bg-white/5 text-sm p-2 py-1 rounded-md' }, statusCode) : '',
			div({ class: "md:text-[54px] text-[44px] leading-none font-semibold" }, contentByStatusCode().title),
			div({ class: 'text-fg-secondary max-w-[500px] text-center' }, contentByStatusCode().description),
			// div({class: 'text-fg-secondary'}, 'Refresh the page or contact support if this problem persists.'),
			div({ class: 'mt-2 flex gap-2' },
				contentByStatusCode().button,
				a({ href: 'mailto:contact@gleam.news', class: 'btn btn-surface h-11 rounded-full' }, 'Contact support'),
			)
		),
	)
}

export default generalErrorPage