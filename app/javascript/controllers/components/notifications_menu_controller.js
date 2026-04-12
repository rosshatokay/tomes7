import { Controller } from "@hotwired/stimulus";
import van from "vanjs-core";
import Popup from "../../components/popup";
import ajax from "../../utils/ajax";
import toast from "../../components/toast";
import timeAgo from "../../utils/timeago";

/**
 * @typedef {object} Notification
 * @property {Date} 	created_at
 * @property {string} kind
 * @property {string} permalink
 * @property {object} notifier
 * @property {string} notifier.avatar
 * @property {string} notifier.username
 */

const { div, button, i, span, img, a } = van.tags

export default class extends Controller {
	initialize() {
		this.menu = this.#createMenu()

		Popup(this.menu)
		van.add(this.element, this.menu)
		this.#bindListeners()
	}

	#bindListeners() {
		this.menu._tippy.setProps({
			onShow: () => this.#getNotifs()
		})
	}

	#getNotifs() {
		this.container = this.menu._tippy.popper.querySelector('.context')
		this.container.innerHTML = ''

		van.add(this.container, div({ class: 'p-6 flex-center' }, div({ class: 'loading-spinner w-6 border-2' })))

		ajax({
			url: '/api/v1/notifications',
			method: 'GET',
			skipAutoErrorRender: true,
			success: (data) => this.#render(data),
			error: () => toast({ message: "Could not get notifications. Try again soon.", type: 'error' })
		})
	}

	#formatKind(kind) {
		switch (kind) {
			case "user_followed":
				return {
					label: " has started following you",
					bg: "bg-primary text-white",
					icon: "ph-plus"
				}
			case "accepted_invite":
				return {
					label: " accepted your invite",
					bg: "bg-blue-500 text-white",
					icon: "ph-check"
				}
		}
	}

	/**
	 * Notification item
	 * @param {Notification} notif 
	 * @returns {HTMLElement}
	 */
	#notifItem(notif) {
		const timeagoElm = div({ class: 'text-xs text-secondary', datetime: notif.created_at })
		const formattedKind = this.#formatKind(notif.kind)
		timeAgo(timeagoElm)

		if (!notif.notifier) {
			return div({ class: `flex items-start gap-3 px-2 p-3 rounded-lg opacity-60` },
				div({ class: 'w-9 aspect-square bg-surface rounded-full flex-center' }, i({ class: 'ph-ph-user text-secondary' })),
				div(
					div({ class: 'text-sm' }, span({ class: 'font-medium' }, 'deleted'), formattedKind.label),
					timeagoElm
				)
			)
		}

		return a({ href: notif.permalink, class: `flex items-start gap-3 hover:bg-surface active:bg-black/10 dark:active:bg-white/10 transition p-3 px-2 rounded-lg` },
			div({class: 'relative'},
				img({ class: 'w-9 aspect-square rounded-full bg-surface', src: notif.notifier.avatar }),
				div({class: `absolute rounded-full aspect-square w-5 flex-center -right-2 -bottom-2 border-2 border-[var(--color-background)] ${formattedKind.bg}`},
					i({class: `ph text-xs ${formattedKind.icon}`, style: 'color: inherit'})
				)
			),
			div(
				div({ class: 'text-sm' }, span({ class: 'font-medium' }, notif.notifier.username), this.#formatKind(notif.kind).label),
				timeagoElm
			)
		)
	}

	/**
	 * Render notifications
	 * @param {Notification[]}
	 */
	#render(notifs) {
		this.container.innerHTML = ''

		if (!notifs?.length) {
			van.add(this.container,
				div({ class: 'flex flex-col items-center p-6 text-center' },
					i({ class: 'ph ph-bell-slash text-2xl mb-2 text-secondary' }),
					div({ class: 'font-medium mb-1' }, 'Nothing here'),
					div({ class: 'text-sm text-secondary' }, 'Looks like you have\'t received any notifications yet.')
				)
			)
			return
		}

		van.add(this.container, div({ class: 'text-sm text-secondary p-2' }, 'Notifications'))

		notifs.forEach(notif => van.add(this.container, this.#notifItem(notif)))
	}

	#createMenu() {
		return div({ class: 'action-menu' },
			div({ class: 'toggler' }, button({ class: 'btn btn-icon w-9 btn-clear' }, i({ class: 'ph ph-bell' }))),
			div({ class: 'context w-[360px] !max-h-[350px] p-1' })
		)
	}
}