class BooksController < ApplicationController
  allow_unauthenticated_access

  include Pagy::Method

  def show
    @book = Book.with_attached_cover.includes(:category, authors: :avatar_attachment).friendly.find(params[:id])
    @seo_image_url = @book.cover.attached? ? @book.cover.service.url(@book.cover.blob.key, transformation: [{ width: 600 }]) : nil
    @toc = @book.toc
    @pagy, @ratings = pagy(@book.ratings.includes(user: { avatar_attachment: :blob }).order(created_at: :desc), limit: 5)
    @user_book = if user_signed_in?
        current_user.user_books.find_by(book_id: @book.id)
      end
    @breadcrumbs = [
      { label: "Home", path: root_path },
      { label: "Books", path: explore_index_path },
      { label: @book.category.name, path: category_path(@book.category.slug) },
      { label: @book.title },
    ]

    set_meta_tags(
      title: "#{@book.title} by #{@book.authors.first.full_name}",
      description: "Read #{@book.title} by #{@book.authors.first.full_name} for free, on Tomes.",
      site: false,
      og: {
        title: :title,
        description: :description,
        type: "book.book",
        site_name: "Tomes",
        url: book_url(@book.slug),
        image: @seo_image_url,
      },
      twitter: {
        title: :title,
        description: :description,
        image: @seo_image_url,
        card: "summary",
      },
    )
  end

  def read
    @book = Book.friendly.find(params[:slug])

    return unless user_signed_in?

    user_book = current_user.user_books.find_or_create_by(book: @book)

    if user_book.previously_new_record?
      Activities::Logger.started_reading(user: current_user, book: @book)
    end
  end

  def epub
    @book = Book.friendly.find(params[:id])

    if @book.epub.attached?
      redirect_to rails_public_blob_url(@book.epub, disposition: "inline"), allow_other_host: true
    else
      render plain: "Book not found", status: :not_found
    end
  end
end
