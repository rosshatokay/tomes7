class Admins::BooksController < Admins::BaseController
  include Pagy::Method

  layout "dashboard"

  def index
    scope = Book.with_attached_cover.includes(:authors, :category).all.order(created_at: :desc)

    @pagy, @books = pagy(scope, limit: 10)
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
      { label: "Books", path: admins_books_path },
      { label: @book.title },
    ]

    render :new
  end

  def create
    @book = Book.build(book_params)
    @book.authors = params[:authors]&.map { |id| Author.find(id) } || []

    if @book.save
      flash[:success] = "Book created"
      # redirect_to admins_books_path
    else
      flash[:error] = "Something went wrong"
      render :new
    end
  end

  def update
    @book = Book.find(params[:id])
    @book.authors = params[:authors]&.map { |id| Author.find(id) } || []

    if @book.update(book_params)
      flash[:success] = "Changes saved"
      redirect_to edit_admins_book_path(@book.hashid)
    else
      flash[:error] = "Something went wrong"
      render :edit
    end
  end

  private

  def book_params
    params.require(:book).permit(:title, :description, :category_id, :wiki_url, :epub, :cover, :published, authors: [], tag_names: [])
  end
end
