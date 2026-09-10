class ExploreController < ApplicationController
  allow_unauthenticated_access

  def index
    genres = Genre.all.map { |c| c.format(permalink: genre_path(c.slug)) }

    authors = Author.with_attached_avatar
      .where("books_count > 0")
      .order(books_count: :desc)
      .first(8)
      .map { |a| a.to_hash(permalink: author_path(a.slug), current_user: current_user) }

    recent_books = Book.published.order(created_at: :desc).first(8).map { |b| b.to_hash(permalink: book_path(b.slug)) }

    render inertia: "Explore/Index", props: {
             genres: genres,
             authors: authors,
             recent_books: recent_books,
           }, meta: seo_tags(
             title: "Explore",
             description: "Browse the Tomes library for the greatest books of all time — by authors and genres. For free.",
           )
  end
end
