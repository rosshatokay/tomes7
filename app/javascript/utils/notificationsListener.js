import ajax from "./ajax"

export default class NotificationsListener {
	/**
	 * Interval for polling in minutes
	 * @type {number}
	 */
	fetchInterval
	
	/**
	 * Notifications listener class constructor
	 * @param {object} options - config
	 * @param {string} endpoint - API endpoint
	 * @param {import("vanjs-core").State<boolean>} options.unreadFlagState - Type of user
	 */
	constructor(options = {}) {
		this.options = options
		this.fetchInterval = 3
		this.pollingTimer = undefined

		this.#listenForIncomingNotifications()
		this.startPolling()
		this.#handleVisibilityChange()

		// stop after an hour
		setTimeout(() => {
			this.stopPolling()
		}, 60000 * 60)
	}

	/**
	 * Poll for existance of new notifications
	 */
	startPolling() {
		if (!this.pollingTimer) {
			this.pollingTimer = setInterval(() => 
				// this.#listenForIncomingNotifications(), this.fetchInterval * 1000)
				this.#listenForIncomingNotifications(), this.fetchInterval * 60000)
		}
	}

	/**
	 * Stop polling
	 */
	stopPolling() {
		if (this.pollingTimer) {
			clearInterval(this.pollingTimer)
			this.pollingTimer = null
		}
	}

	/**
	 * Ping incoming notifications
	 */
	#listenForIncomingNotifications() {
		ajax({
			url: this.options.endpoint,
			method: 'GET',
			skipAutoErrorRender: true,
			success: (res) => {
				if (res.unread_exists) {
					// unread state sets to true here
					this.options.unreadFlagState.val = true
					this.stopPolling()
				}
			},
			error: () => {
				this.stopPolling()
			}
		})
	}

	#handleVisibilityChange() {
		// Check if the page is hidden or visible
		document.addEventListener('visibilitychange', () => {
			if (document.hidden) {
				this.stopPolling()
			} else {
				// Resume polling only if it wasn't already stopped due to max polling time
				if (!this.pollingTimer) {
					this.startPolling()
				}
			}
		})
	}
}