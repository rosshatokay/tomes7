class Api::V1::FeedbacksController < ApplicationController
  rate_limit to: 1, within: 24.hours, only: :request_book, with: -> { render json: { message: "You've hit your daily requests limit. Try again tomorrow.", success: false } }

  def request_book
    permitted = request_book_params
    feedback = current_user.feedbacks.build(subject: "book_request", body: "Requested #{permitted[:book_title]} by #{permitted[:author_name]}")

    if feedback.save
      render json: { success: true }, status: :ok
    else
      render json: { errors: feedback.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def request_book_params
    params.permit(:book_title, :author_name)
  end
end
