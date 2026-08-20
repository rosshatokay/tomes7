class AuthorsController < ApplicationController
  allow_unauthenticated_access except: [:follow, :unfollow]

  def index
    authors = Author.includes(:books, avatar_attachment: :blob).all
    followed_author_ids = current_user ? current_user.followees(Author).pluck(:id) : []

    render inertia: "Authors/Index", props: {
      authors: authors.map { |a|
        {
          full_name: a.full_name,
          avatar_url: a.avatar.attached? ? a.avatar.service.url(a.avatar.blob.key, transformation: [{ width: 250, height: 250 }]) : nil,
          books_count: a.books_count,
          permalink: author_path(a.slug),
          is_followed: followed_author_ids.include?(a.id),
          slug: a.slug,
        }
      },
    }
  end

  def show
    author = Author.includes(avatar_attachment: :blob).friendly.find(params[:id])

    render inertia: "Authors/Show", props: {
      author: {
        full_name: author.full_name,
        avatar_url: author.avatar.attached? ? author.avatar.service.url(author.avatar.blob.key, transformation: [{ width: 250, height: 250 }]) : nil,
        bio: author.bio,
        slug: author.slug,
        is_followed: current_user&.follows?(author),
        books_count: author.books_count,
        followers_count: author.followers_count,
      },
      books: author.books.map { |b| b.to_hash.merge({ permalink: book_path(b.slug) }) },
    }
  end

  def follow
    if current_user.followees(Author).count >= User::MAX_FOLLOWABLE_AUTHORS_COUNT
      render json: { errors: { author: ["You cannot follow more than 20 authors for now."] } }, status: :unprocessable_entity and return
    end

    author = Author.friendly.find(params[:slug]) rescue nil

    unless author.present?
      render json: { errors: { author: ["Could not find author"] } }, status: :unprocessable_entity and return
    end

    current_user.follow!(author)

    render json: { success: true }
  end

  def unfollow
    author = Author.friendly.find(params[:slug]) rescue nil

    unless author.present?
      render json: { errors: { author: ["Could not find author"] } }, status: :unprocessable_entity and return
    end

    current_user.unfollow!(author)

    render json: { success: true }
  end
end
