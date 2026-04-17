import "@hotwired/turbo-rails"
import "./controllers"
import { application } from './controllers/application'

import AuthorSearchController from "./components/search/author_search_controller"
import EpubUploadController from "./controllers/components/epub_upload_controller"
import BookChaptersController from "./controllers/components/book_chapters_controller"
import BookTagsController from "./controllers/components/book_tags_controller"

import TippyHandler from "./components/tippyHandler"
import MicroModal from "micromodal"

const controllers = {
	"author-search": AuthorSearchController,
	"epub-upload": EpubUploadController,
	"book-chapters": BookChaptersController,
	"book-tags": BookTagsController,
}

Object.entries(controllers).forEach(([name, controller]) => {
	application.register(name, controller)
})

document.addEventListener('turbo:load', () => {
	TippyHandler.bind()
	MicroModal.init({disableFocus: true, disableScroll: true})
})