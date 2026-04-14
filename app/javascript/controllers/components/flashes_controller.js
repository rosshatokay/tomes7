import { Controller } from "@hotwired/stimulus";
import toast from "../../components/toast";

export default class extends Controller {
	getType = (type) => {
		switch (type) {
			case 'success':
				return 'success'
			case 'alert':
				return 'warning'
			case 'error':
				return 'error'
			default:
				return ''
		}
	}

	connect() {
		const flashes = this.element.dataset.flashes
		const parsed = JSON.parse(flashes)

		console.log(flashes);
		

		parsed.map(f => toast({
			message: f[1],
			type: this.getType(f[0])
		}))
	}
}