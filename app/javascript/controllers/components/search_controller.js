import { Controller } from "@hotwired/stimulus";
import Search from "../../components/search/search";

export default class extends Controller {
	initialize() {
		console.log(this.element);
		
		new Search({triggerElement: this.element})
	}
}