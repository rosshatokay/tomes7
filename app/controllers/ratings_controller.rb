class RatingsController < ApplicationController
  def create
    book = Book.friendly.find(params[:book_slug])
    rating = current_user.ratings.build(rating_params.merge({ book_id: book.id }))

    if rating.save
      flash.inertia[:toast] = { description: "Your review was added" }
      redirect_back_or_to(book_path(book.slug))
    else
      redirect_to book_path(book.slug), inertia: {
                                          errors: inertia_errors_for(rating),
                                        }
    end
  end

  private

  def rating_params
    params.require(:rating).permit(:body, :score)
  end
end
