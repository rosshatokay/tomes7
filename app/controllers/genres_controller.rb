class GenresController < ApplicationController
  allow_unauthenticated_access

  def show
    genre = Genre.includes(books: [:authors]).friendly.find(params[:id])

    allowed_sorts = {
      "most-recent" => { created_at: :desc },
      "top-rated" => Arel.sql("CASE WHEN ratings_count > 0 THEN (sum_of_scores::float / ratings_count) ELSE 0 END DESC"),
    }

    sort_param = params[:sort]
    sort_key = allowed_sorts.key?(sort_param) ? sort_param : "most-recent"

    books = Book.published.where(genre_id: genre.id).order(allowed_sorts[sort_key])
    pagy, records = pagy(:countless, books)

    render inertia: "Genre/Show", props: {
      genre: genre,
      books: InertiaRails.scroll(pagy) {
        records.map { |b| b.to_hash(permalink: book_path(b.slug)) }
      },
      current_sort: sort_key,
    }
  end

  private

  def sort_books(sort_param, books)
    case sort_param
    when "top-rated"
      books.order()
    else
      books.order(created_at: :desc)
    end
  end
end
