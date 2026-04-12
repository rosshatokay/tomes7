import van from "vanjs-core";

const { div, table, tr, thead, tbody, th, td } = van.tags

/**
 * Custom responsive table
 * @param {string[]} headings - List of headings
 * @param {*} rows 
 * @returns {HTMLElement}
 */
function tabled(headings) {
	const body = tbody()
	const html = div({ class: 'overflow-x-auto' },
		div({ class: 'align-middle min-w-full' },
			table({class: 'min-w-full relative'},
				thead({class: 'border-b border-outline'},
					tr(
						headings.map((h, i) => th({class: `p-3 font-medium text-left ${i == 0 ? 'pl-0' : ''}`}, h))
					)
				),
				body
			),
		),
	)

	const addRow = (tds) => {
		const tdList = tds.map((item, i) => td({class: `p-3 ${i == 0 ? 'pl-0' : ''}`}, item))
		
		van.add(body, tr({class: 'border-b border-outline'}, ...tdList))
	}

	return { table: html, addRow: addRow}
}

export default tabled