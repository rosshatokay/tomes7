import { router } from "@inertiajs/core"
import { useDebounce } from "@uidotdev/usehooks"
import { useEffect, useRef, useState } from "react"

export default function adminSearch() {
	const [searchQuery, setSearchQuery] = useState<string>(() => {
		const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
		return params.get('q') || ''
	})
	const debouncedQuery = useDebounce(searchQuery, 500)
	const isFirstRender = useRef(true)

	useEffect(() => {
		// skip the router visit on the very first mount
		if (isFirstRender.current) {
			isFirstRender.current = false
			return
		}

		const searchParams = new URLSearchParams(window.location.search)

		if (debouncedQuery.trim()) {
			searchParams.set('q', debouncedQuery)
		} else {
			searchParams.delete('q') // clean up the URL if the user deletes their search
		}

		// reset to page 1 when search filters change
		searchParams.delete('page')

		router.visit(`${window.location.pathname}?${searchParams.toString()}`, {
			preserveState: true, // prevents input focus loss while typing
			preserveScroll: true, // prevents the window from jumping to the top
		})
	}, [debouncedQuery])

	return { setSearchQuery }
}