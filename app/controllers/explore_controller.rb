class ExploreController < ApplicationController
  allow_unauthenticated_access

  def index
    @breadcrumbs = [
      { label: "Home", path: root_path },
      { label: "Explore", path: explore_index_path },
    ]
  end

  def trending
    @breadcrumbs = [{ label: "Home", path: root_path }, { label: "Explore", path: explore_index_path }, { label: "Trending" }]
    @books = Book.published.order(readers_count: :desc).first(10)
  end
end
