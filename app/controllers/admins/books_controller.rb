class Admins::BooksController < Admins::BaseController
  include Pagy::Method

  layout "dashboard"

  def index
    scope = Book.with_attached_cover.includes(:authors, :category)

    # if params[:q].present?
    #   scope = scope.where("title ILIKE ?", "%#{params[:q].downcase}%")
    # end

    # @pagy, @books = pagy(scope.order(created_at: :desc), limit: 10)

    render inertia: "Admin/Books", props: {
             books: scope.map { |book| book.to_hash.merge({ permalink: book_path(book.slug) }) },
           }
  end

  def new
    @breadcrumbs = [
      { label: "Books", path: admins_books_path },
      { label: "New book" },
    ]
    @categories = Category.order(:name).pluck(:name, :id)
    @book = Book.new
  end

  def edit
    @book = Book.with_attached_cover.with_attached_epub.includes(tags: []).find(params[:id])
    @categories = Category.order(:name).pluck(:name, :id)
    @breadcrumbs = [
      { label: "Home", path: admins_root_path },
      { label: "Books", path: admins_books_path },
      { label: @book.title },
    ]

    render :new
  end

  def create
    @book = Book.build(book_params)
    @book.authors = params[:authors]&.map { |id| Author.find(id) } || []
    @categories = Category.order(:name).pluck(:name, :id)

    if @book.save
      flash.now[:success] = "Book created"
      render turbo_stream: [
               turbo_stream.update("flash", partial: "partials/flash"),
               turbo_stream.replace("book_details", partial: "admins/books/form", locals: { book: Book.new }),
             ]
    else
      flash.now[:alert] = "There were problems saving the book."

      render turbo_stream: [
               turbo_stream.update("flash", partial: "partials/flash"),
               turbo_stream.replace("book_details", partial: "form", locals: { book: @book }),
             ], status: :unprocessable_entity
    end
  end

  def update
    @book = Book.find(params[:id])
    @book.authors = params[:authors]&.map { |id| Author.find(id) } || []
    @categories = Category.order(:name).pluck(:name, :id)

    if @book.update(book_params)
      flash.now[:success] = "Book updated"
      render turbo_stream: [
               turbo_stream.update("flash", partial: "partials/flash"),
               # Usually, you'd also want to clear the form or append the new item
               turbo_stream.replace("book_details", partial: "admins/books/form", locals: { book: @book, is_edit: true }),
             ]
    else
      flash.now[:error] = "Something went wrong"
      # render :edit, status: :unprocessable_entity
      render turbo_stream: [
               turbo_stream.update("flash", partial: "partials/flash"),
               # Usually, you'd also want to clear the form or append the new item
               turbo_stream.replace("book_details", partial: "admins/books/form", locals: { book: @book, is_edit: true }),
             ], status: :unprocessable_entity
    end
  end

  private

  def book_params
    params.require(:book).permit(:title, :description, :category_id, :wiki_url, :epub, :cover, :published, authors: [], tag_names: [])
  end
end
