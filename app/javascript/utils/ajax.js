import van from "vanjs-core"
import generalErrorPage from "./generalErrorPage"

/**
 * Makes an AJAX request using the Fetch API, similar to jQuery's $.ajax().
 * 
 * @param {object} options - Config options for the request
 * @param {string} options.url - The URL to which the request is sent.
 * @param {'GET'|'POST'|'PUT'|'PATCH'|'DELETE'} [options.method] - The HTTP method to use (e.g., 'GET', 'POST').
 * @param {object} [options.data=null] - The data to send to the server.
 * @param {Object} [options.headers={}] - Additional headers to include in the request.
 * @param {Function} [options.success] - A callback function to run if the request succeeds.
 * @param {Function} [options.error] - A callback function to run if the request fails.
 * @param {boolean} options.skipAutoErrorRender - Do not automatically render an error page when server responds with an error code.
 */
export default function ajax(options = {}) {
	const {
		url,
		method = 'GET',
		data = null,
		headers = {},
		success = {},
		error = {},
	} = options

	const defaultHeaders = {
		'X-Requested-With': 'XMLHttpRequest',
		'Content-Type': 'application/json',
	}

	// Add CSRF token if available
	const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
	if (csrfToken) {
		defaultHeaders['X-CSRF-Token'] = csrfToken
	}

	const fetchOptions = {
		method: method.toUpperCase(),
		headers: {
			...defaultHeaders,
			...headers
		},
		credentials: 'include'
	}

	if (data && method.toUpperCase() !== 'GET') {
		fetchOptions.body = JSON.stringify(data)
	}

	const finalUrl = (method.toUpperCase() === 'GET' && data)
		? `${url}?${new URLSearchParams(data).toString()}`
		: url

	return new Promise((resolve, reject) => {
		fetch(finalUrl, fetchOptions)
			.then(async (response) => {
				const contentType = response.headers.get('content-type')
				const isJSON = contentType && contentType.includes('application/json')
				const responseData = isJSON ? await response.json() : await response.text()

				if (!response.ok) {
					const errObj = { status: response.status, data: responseData }

					if (typeof error === 'function') {
						error(errObj, response.status)
					}

					if (!options.skipAutoErrorRender) {
						window.handleAjaxError?.(errObj)
					}

					reject(errObj)
					return
				}

				if (typeof success === 'function') {
					success(responseData, response.status, response)
				}
				resolve(responseData)
			})
			.catch((err) => {
				console.error('AJAX error:', err)

				if (typeof error === 'function') {
					error?.(err, err.status || 500)
				}

				if (!options.skipAutoErrorRender) window.handleAjaxError?.(err)
				reject(err)
			})
	})
}

bindAjaxError()

function bindAjaxError() {
	function renderError(status) {
		document.body.innerHTML = ''
		van.add(document.body, generalErrorPage(status))
	}

	window.addEventListener('routeNotFound', () => {
		renderError(404)
	})
	
	window.handleAjaxError = function (jqxhr) {
		if (jqxhr.data?.errors) return
		renderError(jqxhr.status)
	}
}