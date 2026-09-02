class Api::V1::Users::BooksController < ApplicationController
  allow_unauthenticated_access only: [:readers]
  rate_limit to: 10, within: 5.minutes, only: :save, with: -> { render json: { error: "You're exceeding the rate limit. Slow down." }, status: :unprocessable_entity }

  def current_position
    book = Book.find(params[:book_id])
    entry = current_user.user_books.find_by(book: book)

    render json: {
      current_position: entry.current_position,
    }
  end

  def readers
    book = Book.friendly.find(params[:book_id])
    readers_scope = book.readers
    collection_data = readers_scope
      .select(:id, :username)
      .includes(avatar_attachment: { blob: :variant_records })
      .limit(10)

    readers_list = collection_data.map do |r|
      {
        username: r.username,
        avatar: r.get_avatar_url(size: 40),
        permalink: profile_path(r.username),
      }
    end

    render json: {
             readers: {
               total_count: readers_scope.count, # Actually runs a SELECT COUNT
               collection: readers_list,
             },
           }
  end

  def update_progress
    return if !user_signed_in?

    book = Book.friendly.find(params[:id])
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
