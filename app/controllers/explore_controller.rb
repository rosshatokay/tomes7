class ExploreController < ApplicationController
  allow_unauthenticated_access

  def index
    @breadcrumbs = [{ label: "Home", path: root_path }, { label: "Explore", path: explore_index_path }]

    @books = Book.with_attached_cover.published
    @trending = @books.order(readers_count: :desc).first(8)
    @selected_ids = @trending.map(&:id)
    active_category_ids = Category.joins(:books).merge(Book.published).where.not(books: { id: @selected_ids }).distinct.pluck(:id)
    @categories = Category.where(id: active_category_ids)
      .includes(books: [:authors, cover_attachment: :blob])
      .merge(Book.published.order(readers_count: :desc))
  end

  def trending
    @breadcrumbs = [{ label: "Home", path: root_path }, { label: "Explore", path: explore_index_path }, { label: "Trending" }]
    @books = Book.published.order(readers_count: :desc).first(10)
  end
end
