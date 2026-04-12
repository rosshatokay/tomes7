import { render, register } from 'timeago.js'
import en_short from 'timeago.js/lib/lang/en_short'

register('en_short', en_short)

/**
 * Binds timeago to an element.
 * @param {HTMLElement} node - A node with `datetime` attribute
 * @param {boolean} short - If should use `en_short`
 * @returns {HTMLElement}
 */
export default function timeAgo(node, short) {
	render(node, short ? 'en_short' : 'en_US', { minInterval: 30 })

	return node
}