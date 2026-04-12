import van from "vanjs-core"

const { div, i, h1, p, a, span } = van.tags

/**
 * @typedef {object} EmptyStateOptions
 * @property {string} title
 * @property {string} description
 * @property {string} customClasses
 * @property {"normal"|"small"} size - Determine the card's font sizes
 * @property {object} cta - CTA configuration
 * @property {HTMLElement} cta.custom - Custom CTA html
 * @property {string} cta.permalink - URL (for non-existing context routes)
 * @property {string} cta.label - CTA label
 * @property {boolean} cta.isSecondary - Is it a secondary colored button
 * @property {boolean} cta.hasArrow - Includes arrow icon
 */

/**
 * Empty state element
 * @param {EmptyStateOptions} config - Configuration options
 * @returns {HTMLElement}
 */
const emptyState = (config = {}) => {
	config.size === undefined ? config.size = 'normal' : config.size
	
	const heading = h1({ class: `font-bold mb-1 text-center mx-auto` }, config.title)
	const description = p({ class: `text-secondary max-w-[400px]` }, config.description)
	let ctaWrapper 

	const html = div({ class: `flex flex-col gap-4 w-full items-center ${config.customClasses} rounded-lg` },
		div({ class: `${config.size == 'small' ? 'w-10' : 'w-12'} aspect-square rounded-lg bg-surface dark:bg-white/10 flex flex-center` },
			i({ class: `ph ph-info ${config.size == 'small' ? 'text-base' : 'text-lg'}` })
		),
		div({ class: 'text-center' },
			heading,
			description
		)
	)

	if (config.cta) {
		const cta = config.cta

		ctaWrapper = div(
			a({href: cta.permalink, class: `btn ${cta.isSecondary ? 'bg-black text-white dark:bg-white dark:text-black' : 'btn-primary'} px-6 rounded-full`},
				span(cta.label),
				cta.hasArrow ? i({class: 'ph ph-arrow-up-right -mr-1'}) : '',
			)
		)

		van.add(html, cta.custom ? cta.custom : ctaWrapper)
	}

	if (config.size == 'small') {
		heading.classList.add('text-lg')
		description.classList.add('text-sm')
		ctaWrapper?.querySelector('a')?.classList.add('h-8')
		ctaWrapper?.querySelector('a span')?.classList.add('text-sm')
	}
	
	if (config.size == 'normal') {
		heading.classList.add('text-xl')
		description.classList.add('text-base')
		ctaWrapper?.querySelector('a')?.classList.add('h-10')
		ctaWrapper?.querySelector('a span')?.classList.add('text-base')
	}

	return html
}

export default emptyState