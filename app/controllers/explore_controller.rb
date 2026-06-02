class ExploreController < ApplicationController
  allow_unauthenticated_access

  def index
    @breadcrumbs = [{ label: "Home", path: root_path }, { label: "Explore", path: explore_index_path }]

    @books = Book.with_attached_cover.published
    @authors = Author.with_attached_avatar
    @trending_books = @books.order(readers_count: :desc).first(8)
    @trending_authors = @authors.order(books_count: :desc).take(16)
    @selected_ids = @trending_books.map(&:id)
    active_category_ids = Category.joins(:books).merge(Book.published).where.not(books: { id: @selected_ids }).distinct.pluck(:id)
    @categories = Category.where(id: active_category_ids)
      .includes(books: [:authors, cover_attachment: :blob])
      .merge(Book.published.order(readers_count: :desc))

    set_meta_tags(
      reverse: true,
      title: "Explore timesless classics | Free Literature & Reference Library",
      description: "Discover thousands of free classic books and historical texts on Tomes. Explore curated collections across Literature, Science, Philosophy, and more. Start reading the world's greatest wisdom today.",
      og: {
        url: "https://tomes.club",
        type: "website",
        title: "Explore the free digital library of timeless classics",
        description: :description,
        image: helpers.asset_url("/splash.jpg"),
      },
      twitter: {
        card: "summary_large_image",
        image: helpers.asset_url("/splash.jpg"),
      },
    )
  end

  def trending_books
    @breadcrumbs = [{ label: "Home", path: root_path }, { label: "Explore", path: explore_index_path }, { label: "Trending books" }]
    @books = Book.published.order(readers_count: :desc).first(10)

    set_meta_tags(
      reverse: true,
      title: "Trending books",
      description: "Discover trending free classic books and historical texts on Tomes.",
      og: {
        url: "https://tomes.club",
        type: "website",
        title: "Trending books",
        description: :description,
        image: helpers.asset_url("/splash.jpg"),
      },
      twitter: {
        card: "summary_large_image",
        image: helpers.asset_url("/splash.jpg"),
      },
    )
  end

  def trending_authors
    @breadcrumbs = [{ label: "Home", path: root_path }, { label: "Explore", path: explore_index_path }, { label: "Trending books" }]
    @authors = Author.with_attached_avatar.order(books_count: :desc)

    set_meta_tags(
      reverse: true,
      title: "Trending authors",
      description: "Discover trending the authors behind the greatest timeless classics on Tomes.",
      og: {
        url: "https://tomes.club",
        type: "website",
        title: "Trending books",
        description: :description,
        image: helpers.asset_url("/splash.jpg"),
      },
      twitter: {
        card: "summary_large_image",
        image: helpers.asset_url("/splash.jpg"),
      },
    )
  end
end
