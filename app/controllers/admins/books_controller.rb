class Admins::BooksController < Admins::BaseController
  include Pagy::Method

  def index
    scope = Book.with_attached_cover.includes(:authors, :category)

    render inertia: "Admin/Books", props: {
             books_count: Book.count,
             books: InertiaRails.defer {
               scope.map { |book|
                 book.to_hash.merge({
                   permalink: book_path(book.slug),
                   id: book.hashid,
                   category: book.category.name,
                   readers_count: book.readers_count,
                 })
               }
             },
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
    book = Book.build(book_params)
    author_ids = params[:book][:authors]&.pluck(:id) || []
    book.authors = Author.find(author_ids)

    if book.save
      flash.inertia[:toast] = { description: "Book created successfully" }
      redirect_to admins_books_path
    else
      flash.inertia[:toast] = { description: "Something went wrong" }
      redirect_to admins_books_path, inertia: {
                                       errors: inertia_errors_for(book),
                                     }
    end
  end

  def update
    book = Book.find(params[:id])
    author_ids = params[:book][:authors]&.pluck(:id) || []
    book.authors = Author.find(author_ids)

    if book.update(book_params)
      flash.inertia[:toast] = { description: "Book updated successfully" }
      redirect_to admins_books_path
    else
      flash.inertia[:toast] = { description: "Something went wrong" }
      redirect_to admins_books_path, inertia: {
                                       errors: inertia_errors_for(book),
                                     }
    end
  end

  private

  def book_params
    params.require(:book).permit(:title, :description, :category_id, :wiki_url, :epub, :cover, :published, authors: [], tag_names: [])
  end
end
