class BooksController < ApplicationController
  allow_unauthenticated_access

  def index
    render inertia: "Books/Index", props: {
      categories: JSON.parse(Category.all.take(4).to_json(only: [:name, :slug])),
      books: InertiaRails.defer { Book.published.map { |b| b.to_hash.merge({ permalink: book_path(b.slug) }) } },
    }
  end

  def show
    book = Book.with_attached_cover.includes(:category, authors: :avatar_attachment).friendly.find(params[:id])

    render inertia: "Books/Show", props: {
      **format_book(book),
    }
  end

  private

  def format_book(book)
    {
      book: {
        title: book.title,
        cover_url: book.cover.attached? ? book.cover.service.url(book.cover.blob.key, transformation: [{ width: 600 }]) : nil,
        description: book.description,
        wiki_url: book.wiki_url,
      },
      tags: JSON.parse(book.tags.to_json(only: [:name])),
      category: {
        name: book.category.name,
        permalink: "/",
      },
      authors: book.authors.map { |a|
        {
          name: a.full_name,
          bio: a.bio,
          avatar_url: a.avatar.attached? ? a.avatar.service.url(a.avatar.blob.key, transformation: [{ width: 100 }]) : nil,
          permalink: author_path(a.slug),
        }
      },
    }
  end
end
