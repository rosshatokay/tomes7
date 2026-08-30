class Api::V1::BooksController < ApplicationController
  allow_unauthenticated_access

  def ratings
    book = Book.includes(ratings: [user: [avatar_attachment: :blob]]).friendly.find(params[:book_slug])
    ratings = book.ratings.formatted

    render json: {
      ratings_count: book.ratings_count,
      average_rating: book.average_rating,
      score_frequencies: book.score_frequencies,
      ratings: ratings * 2,
    }
  end
end
