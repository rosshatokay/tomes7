class CategoriesController < ApplicationController
  include Pagy::Method
  allow_unauthenticated_access

  def show
    @category = Category.find_by(slug: params[:id])
    @breadcrumbs = [
      { label: "Home", path: root_path },
      { label: "Explore", path: explore_index_path },
      { label: @category.name },
    ]

    books_scope = @category.books.published
    books_scope = apply_filters(books_scope)

    @pagy, @books = pagy(books_scope, limit: 10)

    respond_to do |format|
      format.html
      format.turbo_stream
    end

    set_meta_tags(
      title: "Free #{@category.name} Books | Read Timeless #{@category.name} Classics",
      description: "Access a curated collection of free #{@category.name} books and classic texts. From foundational works to rare archives, start reading #{@category.name} masterpieces on Tomes today.",
      og: {},
    )
  end

  private

  def apply_filters(scope)
    scope = apply_popularity(scope)
    scope = apply_sort(scope)
    scope
  end

  def apply_sort(scope)
    case params[:sort]
    when "recent"
      scope.order(created_at: :desc)
    when "oldest"
      scope.order(created_at: :asc)
    else
      scope
    end
  end

  def apply_popularity(scope)
    case params[:popularity]
    when "most-popular"
      scope.order(ratings_count: :desc)
    when "least-popular"
      scope.order(ratings_count: :asc)
    else
      scope.order(ratings_count: :desc)
    end
  end
end
