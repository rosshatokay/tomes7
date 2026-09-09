class GenresController < ApplicationController
  allow_unauthenticated_access

  def show
    genre = Genre.includes(books: [:authors]).friendly.find(params[:id])
    books = Book.published.where(genre_id: genre.id).order(created_at: :desc)
    pagy, records = pagy(:countless, books)

    render inertia: "Genre/Show", props: {
      genre: genre,
      books: InertiaRails.scroll(pagy) { records.map { |b| b.to_hash(permalink: book_path(b.slug)) } },
    }
  end
end
