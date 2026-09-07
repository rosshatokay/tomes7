class FeedsController < ApplicationController
  allow_unauthenticated_access except: [:my_books]

  def my_books
    handle_signed_in_books
  end

  def community
    render inertia: "Feeds/Community", props: {
      posts: Rating.includes(book: [:authors, cover_attachment: :blob], user: [avatar_attachment: :blob]).all.map { |r| r.to_community },
    }
  end

  private

  def handle_signed_in_books
    available_tabs = ["reading", "following", "saved"]
    current_tab = params[:tab].presence || "reading"

    if params[:tab].present? && !available_tabs.include?(current_tab)
      return redirect_to my_books_path(tab: "reading")
    end

    books = case current_tab
      when "reading"
        current_user.currently_reading
      when "following"
        current_user.books_by_followed_authors
      when "saved"
        current_user.likees(Book).includes(:authors, cover_attachment: :blob)
      end

    pagy, records = pagy(:countless, books)

    render inertia: "Feeds/MyBooks", props: {
             books: InertiaRails.scroll(pagy) { records.map { |book| book.to_hash(permalink: book_path(book.slug)) } },
           }, meta: seo_tags(
             title: "My books",
           )
  end
end
