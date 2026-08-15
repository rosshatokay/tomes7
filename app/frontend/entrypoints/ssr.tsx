import React from "react"
import { createInertiaApp } from "@inertiajs/react"
import createServer from "@inertiajs/react/server"
import ReactDOMServer from "react-dom/server"
import BaseLayout from "../layouts/BaseLayout" // Adjust this path if needed

createServer((page) =>
  createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    layout: () => BaseLayout,
    title: (title) => (title ? `${title} | highlight.cv` : "highlight.cv"),
    resolve: (name) => {
      // Use Vite's import.meta.glob to eagerly load pages for SSR
      const pages = import.meta.glob("../pages/**/*.tsx", { eager: true })
			return pages[`../pages/${name}.tsx`] as { default: React.ComponentType<any> }
    },
    setup: ({ App, props }) => <App {...props} />,
  })
)