class BooksController < ApplicationController
  allow_unauthenticated_access except: %i[ save ]

  def index
    categories = JSON.parse(Category.all.to_json(only: [:name, :slug]))

    if params[:tab].present?
      category_tab = Category.find_by(slug: params[:tab])
    end

    scope = category_tab.present? ? Book.published.where(category_id: category_tab.id) : Book.published.all
    data = scope.map { |b| b.to_hash.merge({ permalink: book_path(b.slug) }) }
    fake_data.map { |f| data << f }

    render inertia: "Books/Index", props: {
             categories: categories,
             books: data,
           }, meta: [
             { title: user_signed_in? ? "Books" : "Read the greatest books of all time. For free." },
           ]
  end

  def show
    book = Book.with_attached_cover.includes(:category, ratings: [user: [avatar_attachment: :blob]], authors: [avatar_attachment: :blob]).friendly.find(params[:id])

    render inertia: "Books/Show", props: {
             **format_book(book),
             ratings_snippet: book.ratings.formatted.first(3),
             similar_books: InertiaRails.defer { book.similar_books(4).map { |b| b.to_hash.merge({ permalink: book_path(b.slug) }) } },
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

      if user_book.previously_new_record?
        Activities::Logger.started_reading(user: current_user, book: book)
      end
    end

    render inertia: "Books/Read", props: {
      book: book.to_hash.merge(
        epub_file_path: book.epub.attached? ? rails_public_blob_url(book.epub, disposition: "inline") : nil,
        share_url: book_url(book.slug),
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
      category: {
        name: book.category.name,
        permalink: books_path(tab: book.category.slug),
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

  def fake_data
    [
      {
        title: "The Republic",
        cover: "https://ik.imagekit.io/tomes/books/covers/z18sp5x11k9a8qfrrtvlvcshghxv?tr=w-1920,c-at_max",
        author_names: "Plato",
        published: true,
        average_rating: rand(3..5),
        slug: "/",
        ratings_count: rand(1..300),
      },
      {
        title: "Jane Eyre",
        cover: "https://ik.imagekit.io/tomes/books/covers/s1hmmvhu9zva5gs54q0sd04cozdj?tr=w-1920,c-at_max",
        author_names: "Charlotte Brontë",
        published: true,
        average_rating: rand(3..5),
        slug: "/",
        ratings_count: rand(1..300),
      },
      {
        title: "Meditations",
        cover: "https://ik.imagekit.io/tomes/books/covers/hanbexxqrd8n4a6uo2yf6im7nfqr?tr=w-1920,c-at_max",
        author_names: "Marcus Aurelius",
        published: true,
        average_rating: rand(3..5),
        slug: "/",
        ratings_count: rand(1..300),
      },
      {
        title: "Meditations",
        cover: "https://ik.imagekit.io/tomes/books/covers/hanbexxqrd8n4a6uo2yf6im7nfqr?tr=w-1920,c-at_max",
        author_names: "Marcus Aurelius",
        published: true,
        average_rating: rand(3..5),
        slug: "/",
        ratings_count: rand(1..300),
      },
    ]
  end
end
