class FeedsController < ApplicationController
  def index
    @collection = current_user.currently_reading
    @recently_added_books = Book.published.order(created_at: :desc).take(8)
    @activities = Activity.includes(:user, :subject).where(user_id: current_user.followees(User).select(:id)).order(created_at: :desc).first(5)
  end

  def show
  end
end
