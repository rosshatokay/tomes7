class RatingsController < ApplicationController
  def create
    book = Book.select(:id).find(rating_params[:book_id])
    @rating = current_user.ratings.build(rating_params.merge({ book_id: book.id }))

    if @rating.save
      Activities::Logger.added_a_review(user: current_user, book: book)

      respond_to do |format|
        format.turbo_stream {
          render turbo_stream: [
            turbo_stream.prepend("reviews_list", partial: "ratings/review", locals: { review: @rating }),
            turbo_stream.remove("empty_reviews"),
          ]
        }
        format.json { render json: { message: "Review added successfully" }, status: :ok }
      end
    else
      respond_to do |format|
        format.turbo_stream
        format.json { render json: { errors: rating.errors.full_messages }, status: :unprocessable_entity }
      end
    end
  end

  private

  def rating_params
    params.require(:rating).permit(:book_id, :score, :body)
  end
end
