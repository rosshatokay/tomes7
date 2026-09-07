export type ThemeOptions = "system" | "light" | "dark"

declare global {
	interface Window {
		Theme: {
			getTheme: () => ThemeOptions
			initialize: () => void
			onThemeLoaded: (e: any) => void
			setByPreference: () => void
			setTheme: (theme: ThemeOptions) => void
			prefersDark: () => boolean
		}
	}
}

export { }