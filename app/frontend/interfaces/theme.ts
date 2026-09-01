declare global {
	interface Window {
		Theme: {
			getTheme: () => "system" | "light" | "dark"
			initialize: () => void
			onThemeLoaded: (e: any) => void
			setByPreference: () => void
			setTheme: (theem: "system" | "light" | "dark") => void
			prefersDark: () => boolean
		}
	}
}

export { }