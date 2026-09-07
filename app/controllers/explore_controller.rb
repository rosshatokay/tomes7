class ExploreController < ApplicationController
  allow_unauthenticated_access

  def index
    categories = JSON.parse(Category.all.to_json(only: [:name, :slug]))
    authors = Author.with_attached_avatar
      .where("books_count > 0")
      .order(books_count: :desc)
      .first(8)
      .map { |a| a.to_hash(permalink: author_path(a.slug), current_user: current_user) }

    recent_books = Book.published.order(created_at: :desc).map { |b| b.to_hash(permalink: book_path(b.slug)) }

    render inertia: "Explore/Index", props: {
             categories: categories,
             authors: authors,
             recent_books: recent_books,
           }, meta: seo_tags(
             title: "Explore",
             description: "Browse the Tomes library for the greatest books of all time — by authors and genres. For free.",
           )
  end
end
