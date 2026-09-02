import { useHttp } from "@inertiajs/react";
import { useEffect } from "react";
import { Page } from "react-epub-viewer";

const styleStr = `
	html.light {
		body {
			color: black !important;
		}
	}
	html.dark {
		body {
			color: white !important;
		}
	}

	a:hover {
		color: inherit !important;
		text-decoration: none;
	}
`

export function addStyleToReader(contents: any) {
	/**
	 * @type {HTMLDocument}
	 */
	const doc = contents.document
	const style = doc.createElement("style");
	const defaultSysTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

	style.innerHTML = styleStr;

	window.Theme.onThemeLoaded((e: any) => {
		doc.documentElement.removeAttribute('class')
		doc.documentElement.classList.add(e.detail.theme)
	})

	doc.documentElement.classList.add(defaultSysTheme)
	doc.head.appendChild(style);
}

export function addCustomFont(contents: any) {
	const doc = contents.document;
	const link = doc.createElement("link");

	link.rel = "stylesheet";
	link.href = "https://fonts.googleapis.com/css2?family=Crimson+Text&display=swap";
	doc.head.appendChild(link);
}


export function useUpdateBookProgress(bookSlug: string) {
	// update progress
	const http = useHttp({ progress: 0, current_position: "" })

	const handleUpdate = ({ progress, current_position }: { current_position: string, progress: number }) => {
		http.setData({
			progress: (progress / 100),
			current_position: current_position
		})
		http.patch(`/api/v1/users/books/${bookSlug}/update-progress`)
	}

	return {
		processing: http.processing,
		update: handleUpdate
	}
}