import { useEffect } from "react";

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

function addStyleToReader(contents: any) {
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

function addCustomFont(contents: any) {
	const doc = contents.document;
	const link = doc.createElement("link");

	link.rel = "stylesheet";
	link.href = "https://fonts.googleapis.com/css2?family=Crimson+Text&display=swap";
	doc.head.appendChild(link);
}

export { addStyleToReader, addCustomFont }