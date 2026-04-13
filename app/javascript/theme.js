const Theme = (() => {
	const root = document.querySelector('html')
  const prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)')
  let storedTheme = localStorage.getItem("theme")
	const isInLibrary = document.querySelector('html').classList.contains('library')
	/**
	 * @type {HTMLInputElement}
	 */
  let themeSelector

  function triggerThemeLoaded(theme)
  {
    const event = new CustomEvent('themeLoaded', {
			detail: {
				theme: theme
			}
		})
		
    document.dispatchEvent(event)
  }

	/**
	 * Set appropriate theme for DOM
	 * @param {String} theme {light | dark}
	 * @param {Boolean} isSysPref Is system pref?
	 */
  function setTheme(theme, isSysPref)
  {
		switch (theme) {
			case "light":
				root.classList.remove('dark')
				root.classList.add('light')
			break
			case "dark":
				root.classList.add('dark')
				root.classList.remove('light')
			break
			case "system":
				setByPreference()
			break
		}

		// If in library, add library theme also
		if (isInLibrary) {
			root.classList.add('library')
		}

		// If pref is not system
		if (!isSysPref) {
			localStorage.setItem("theme", theme)
		} else {
			localStorage.setItem("theme", 'system')
		}

		storedTheme = localStorage.getItem("theme")

		triggerThemeLoaded(theme)
  }

  function setByPreference()
  {
    if (prefersDarkTheme.matches)
    {
      setTheme('dark', true)
    } else {
      setTheme('light', true)
    }
  }

  function initialize()
  {
    if (storedTheme) {
      root.removeAttribute("class")

      setTheme(storedTheme)
			
			setTimeout(function(){
				triggerThemeLoaded(storedTheme)
			}, 50)
    } else {
      setByPreference()
    }

		listenToSysPref()

		document.addEventListener('DOMContentLoaded', () => {
			themeSelector = document.getElementById('theme-selector')
		})
  }

	function listenToSysPref()
	{
		// needs to listen for updates
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',({ matches }) => {
			if (storedTheme == "system" || storedTheme == undefined) {
			}
			if (matches) {
				setTheme('dark', true)
			} else {
				setTheme('light', true)
			}
		})
	}

	/**
	 * Get current device theme preference
	 * @returns {'system'|'dark'|'light'}
	 */
	function getTheme() {
		return localStorage.getItem('theme')
	}

  return {
    initialize,
		setTheme,
		getTheme,
		setByPreference,
    onThemeLoaded: (callback) => {
      document.addEventListener('themeLoaded', callback);
    }
  }
})()

Theme.initialize()

window.theme = Theme