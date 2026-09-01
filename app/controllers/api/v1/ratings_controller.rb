class Api::V1::RatingsController < ApplicationController
  allow_unauthenticated_access

  def show
    book = Book.includes(ratings: [user: [avatar_attachment: :blob]]).friendly.find(params[:book_slug])
    scope = book.ratings.formatted
    @pagy, ratings = pagy(scope, limit: 10)

    render json: {
      ratings_count: book.ratings_count,
      average_rating: book.average_rating,
      score_frequencies: book.score_frequencies,
      ratings: ratings,
      pagination: create_pagination(@pagy),
    }
  end
end
