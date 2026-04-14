import consumer from "./consumer"

consumer.subscriptions.create("NotificationsChannel", {
	connected() {
		// Called when the subscription is ready for use on the server
		console.log('connection made');

	},

	disconnected() {
		// Called when the subscription has been terminated by the server
		console.log('diconnected');
	},

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
