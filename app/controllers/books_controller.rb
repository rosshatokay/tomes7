class BooksController < ApplicationController
  allow_unauthenticated_access except: %i[ save ]

  def index
    render inertia: "Books/Index", props: {
      categories: JSON.parse(Category.all.take(4).to_json(only: [:name, :slug])),
      books: Book.published.map { |b| b.to_hash.merge({ permalink: book_path(b.slug) }) },
    }
  end

  def show
    book = Book.with_attached_cover.includes(:category, authors: :avatar_attachment).friendly.find(params[:id])

    render inertia: "Books/Show", props: {
      **format_book(book),
      similar_books: InertiaRails.defer { book.similar_books(4).map { |b| b.to_hash.merge({ permalink: book_path(b.slug) }) } },
    }
  end

  def save
    book = Book.friendly.find(params[:slug]) rescue nil

    unless book.present?
      render json: { error: "Could not find book" }, status: :unprocessable_entity and return
    end

    current_user.toggle_like!(book)

    is_liked = current_user.likes?(book)

    if is_liked
      Activities::Logger.saved_book(user: current_user, book: book)
    end

    render json: { success: true }
  end

  private

  def format_book(book)
    {
      book: {
        title: book.title,
        slug: book.slug,
        cover_url: book.cover.attached? ? book.cover.service.url(book.cover.blob.key, transformation: [{ width: 600 }]) : nil,
        description: book.description,
        wiki_url: book.wiki_url,
        is_saved: current_user&.likes?(book) || false,
        average_rating: book.average_rating,
        ratings_count: book.ratings_count,
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
