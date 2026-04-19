import { Controller } from "@hotwired/stimulus";
import ajax from "../../utils/ajax";
import toast from "../../components/toast";
import van from "vanjs-core";
import loadableButton from "../../components/loadableButton";

export default class extends Controller {
  static values = { isFollowing: Boolean }

  #isLoading = van.state(false)

  connect() {
    this.#render()
  }

  isFollowingValueChanged() {
    this.#render()
  }

  #render() {
    this.element.innerHTML = ""

    van.add(this.element,
      () => loadableButton(
        {
          class: `btn ${this.isFollowingValue ? "btn-surface" : "btn-primary"} h-9`,
          onclick: () => this.#follow()
        },
        { isLoading: this.#isLoading.val },
        this.isFollowingValue ? "Unfollow" : "Follow"
      ),
    )
  }

	#updateCounter(hasFollowed) {
		const countElm = document.getElementById('followers_count')
		const countLabel = document.getElementById('followers_count_label')
		let currCount = parseInt(countElm.innerText)

		if (hasFollowed) {
			currCount++
		} else {
			currCount--
		}

		countElm.innerText = currCount
		countLabel.innerText = currCount == 1 ? 'Follower' : 'Followers'
	}
	
  #follow() {
    this.#isLoading.val = true

    ajax({
      url: "/api/v1/users/follow",
      method: "POST",
      skipAutoErrorRender: true,
      data: {
        username: location.href.split("@").at(-1)
      },
      success: (res) => {
        if (res.success) {
          toast({ message: res.message })
          this.isFollowingValue = res.is_following
					this.#updateCounter(res.is_following)
        } else {
          toast({ message: "Something went wrong. Try again soon.", type: "warning" })
        }
        this.#isLoading.val = false
      },
      error: (res) => {
        if (res.data.errors?.length) {
          res.data.errors.forEach(err => toast({ message: err, type: "error" }))
        }
        this.#isLoading.val = false
      }
    })
  }
}