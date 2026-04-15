import consumer from "./consumer"

consumer.subscriptions.create("NotificationsChannel", {
	connected() {},

	disconnected() {},

	received(data) {
		const badge = document.getElementById('unread-notifs-badge')

		// Called when there's incoming data on the websocket for this channel
		if (data.unread_messages) {
			badge.classList.remove('hidden')
		} else {
			badge.classList.add('hidden')
		}

	}
});
