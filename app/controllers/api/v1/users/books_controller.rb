class Api::V1::Users::BooksController < ApplicationController
  allow_unauthenticated_access only: [:update_progress]
  rate_limit to: 10, within: 5.minutes, only: :save, with: -> { render json: { error: "You're exceeding the rate limit. Slow down." }, status: :unprocessable_entity }

  def current_position
    book = Book.find(params[:book_id])
    entry = current_user.user_books.find_by(book: book)

    render json: {
      current_position: entry.current_position,
    }
  end

  def update_progress
    return if !user_signed_in?

    book = Book.find(params[:id])
    entry = current_user.user_books.find_by(book: book)

    if entry.update!(progress_params)
      render json: { success: true }, status: :ok
    else
      render json: { success: false }, status: :unprocessable_entity
    end
  end

  def save
    book = Book.find(params[:book_id])

    current_user.toggle_like!(book)

    if current_user.likes?(book)
      Activities::Logger.saved_book(user: current_user, book: book)
    end

    render json: { saved: current_user.likes?(book) }
  end

  private

  def progress_params
    params.permit(:progress, :current_position)
  end
end
