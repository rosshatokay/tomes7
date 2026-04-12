class Api::V1::BooksController < Admins::BaseController
  before_action :find_book

  def toc
    render json: {
      generated: !@book.toc.nil?,
      toc: @book.toc,
    }
  end

  def generate_toc
    toc = TocGenerator.new(@book)

    begin
      chapters = toc.generate

      render json: chapters
    rescue => e
      render json: "Error occurred: #{e}"
    end
  end

  private

  def find_book
    @book = Book.find(params[:book_id])
  end
end
