class Api::V1::Admins::BooksController < Admins::BaseController
  def show
    book = Book.with_attached_epub.with_attached_cover.includes(:tags, authors: [avatar_attachment: :blob]).find(params[:id])
    data = {
      title: book.title,
      id: book.id,
      description: book.description,
      published: book.published,
      cover_url: book.get_cover_url,
      wiki_url: book.wiki_url,
      details: book.details,
      tags: book.tags.select(:id, :name),
      genre: {
        name: book.genre.name,
        id: book.genre.id,
      },
      authors: book.authors.map { |a|
        {
          id: a.id,
          full_name: a.full_name,
          avatar_url: a.get_avatar_url,
        }
      },
      epub: !book.epub.attached? ? nil : {
        filename: book.epub.filename,
        byte_size: book.epub.byte_size,
      },
    }

    render json: {
             book: data,
           }
  end
end
