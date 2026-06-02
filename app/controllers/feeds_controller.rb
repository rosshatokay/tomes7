class FeedsController < ApplicationController
  def index
    @collection = current_user.currently_reading
    @recently_added_books = Book.with_attached_cover.published.order(created_at: :desc).take(8)
    @activities = Activity.includes(:user, :subject).where(user_id: current_user.followees(User).select(:id)).order(created_at: :desc).first(5)
    @recommended_authors = Author.includes(avatar_attachment: :blob).where.not(books_count: 0).take(9)

    set_meta_tags(
      title: "Home",
      reverse: true,
    )
  end
end
