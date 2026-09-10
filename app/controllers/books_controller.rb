class BooksController < ApplicationController
  allow_unauthenticated_access except: %i[ save ]

  def index
    genres = JSON.parse(Genre.all.to_json(only: [:name, :slug]))

    if params[:tab].present?
      genre_tab = Genre.find_by(slug: params[:tab])
    end

    scope = genre_tab.present? ? Book.published.where(genre_id: genre_tab.id) : Book.published.all
    data = scope.map { |b| b.to_hash(permalink: book_path(b.slug)) }

    render inertia: "Books/Index", props: {
             genres: genres,
             books: data,
           }, meta: [
             { title: user_signed_in? ? "Books" : "Read the greatest books of all time. For free." },
           ]
  end

  def show
    book = Book.with_attached_cover.includes(
      :genre,
      :readers,
      ratings: [user: [avatar_attachment: :blob]],
      authors: [avatar_attachment: :blob],
    ).friendly.find(params[:id])

    progress = if user_signed_in?
        entry = current_user.user_books.find_by(book: book)
      end

    render inertia: "Books/Show", props: {
             **format_book(book),
             ratings_snippet: book.ratings.formatted.first(3),
             similar_books: InertiaRails.defer { book.similar_books(limit: 4).map { |b| b.to_hash(permalink: book_path(b.slug)) } },
             readers: InertiaRails.defer { get_readers(book) },
             progress: entry.present? && entry.progress,
           }, meta: seo_tags(
             title: book.title,
             description: "Read #{book.title} by #{book.authors.first.full_name} for free, on Tomes.",
             image: book.get_cover_url,
           )
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

  def read
    book = Book.friendly.find(params[:book_id])

    if user_signed_in?
      user_book = current_user.user_books.find_or_create_by(book: book)
      current_position = current_user.user_books.find_by(book: book)&.current_position

      if user_book.previously_new_record?
        Activities::Logger.started_reading(user: current_user, book: book)
      end
    end

    render inertia: "Books/Read", props: {
      book: book.to_hash(permalink: book_path(book.slug)).merge(
        epub_file_path: book.epub.attached? ? rails_public_blob_url(book.epub, disposition: "inline") : nil,
        share_url: book_url(book.slug),
        current_position: current_position,
      ),
    }
  end

  def epub
    book = Book.friendly.find(params[:book_id])

    if book.epub.attached?
      redirect_to rails_public_blob_url(book.epub, disposition: "inline"), allow_other_host: true
    else
      render plain: "Book not found", status: :not_found
    end
  end

  private

  def format_book(book)
    {
      book: {
        title: book.title,
        slug: book.slug,
        cover_url: book.get_cover_url(1000),
        description: book.description,
        wiki_url: book.wiki_url,
        is_saved: current_user&.likes?(book) || false,
        average_rating: book.average_rating,
        ratings_count: book.ratings_count,
        share_url: book_url(book.slug),
        read_path: book_read_path(book.slug),
        details: book.get_details,
      },
      tags: JSON.parse(book.tags.to_json(only: [:name])),
      genre: {
        name: book.genre.name,
        permalink: book_path(tab: book.genre.slug),
      },
      authors: book.authors.map { |a|
        {
          full_name: a.full_name,
          bio: a.bio,
          avatar_url: a.avatar.attached? ? a.avatar.service.url(a.avatar.blob.key, transformation: [{ width: 100 }]) : nil,
          permalink: author_path(a.slug),
        }
      },
    }
  end

  def get_readers(book)
    return unless book.readers_count >= 3
    readers = book.readers.select(:id, :username).includes(avatar_attachment: :blob).limit(3)

    {
      total_count: book.readers_count,
      preview_list: readers.map { |u|
        {
          username: u.username,
          avatar_url: u.get_avatar_url,
        }
      },
    }
  end
end
