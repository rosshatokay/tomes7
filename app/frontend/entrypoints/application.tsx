import AdminLayout from '@/layouts/AdminLayout'
import BaseLayout from '@/layouts/BaseLayout'
import { createInertiaApp } from '@inertiajs/react'
import { createRoot, hydrateRoot } from 'react-dom/client'

createInertiaApp({
  pages: "../pages",
  strictMode: true,
	layout: (name) => {
		if (name.startsWith("Admin/")) {
			return AdminLayout
		}

		return BaseLayout
	},
	title: (title) => title ? `${title} | Tomes` : 'Tomes',
  defaults: {
    form: {
      forceIndicesArrayFormatInFormData: false,
      withAllErrors: true,
    },
    visitOptions: () => {
      return { queryStringArrayFormat: "brackets" }
    },
  },
	setup({el, App, props}) {
		if (el) {
			if (el.dataset.serverRendered) {
				hydrateRoot(el, <App {...props} />)
			} else {
				createRoot(el).render(<App {...props} />)
			}
		}
	}
}).catch((error) => {
  // This ensures this entrypoint is only loaded on Inertia pages
  // by checking for the presence of the root element (#app by default).
  // Feel free to remove this `catch` if you don't need it.
  if (document.getElementById("app")) {
    throw error
  } else {
    console.error(
      "Missing root element.\n\n" +
      "If you see this error, it probably means you loaded Inertia.js on non-Inertia pages.\n" +
      'Consider moving <%= vite_typescript_tag "inertia.tsx" %> to the Inertia-specific layout instead.',
    )
  }
})
