import React from "react"
import { createInertiaApp } from "@inertiajs/react"
import createServer from "@inertiajs/react/server"
import ReactDOMServer from "react-dom/server"
import BaseLayout from "../layouts/BaseLayout" // Adjust this path if needed
import AdminLayout from "@/layouts/AdminLayout"

createServer((page) =>
  createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
		serverHead: true,
		layout: (name) => {
      if (name.startsWith("Admin/")) {
        return AdminLayout
      }
      return BaseLayout
    },
    // title: (title) => (title ? `${title} - Tomes` : "Tomes"),
    resolve: (name) => {
      // Use Vite's import.meta.glob to eagerly load pages for SSR
      const pages = import.meta.glob("../pages/**/*.tsx", { eager: true })
			return pages[`../pages/${name}.tsx`] as { default: React.ComponentType<any> }
    },
    setup: ({ App, props }) => <App {...props} />,
  })
)