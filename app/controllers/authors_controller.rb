class AuthorsController < ApplicationController
  allow_unauthenticated_access

  def index
    authors = Author.includes(:books, avatar_attachment: :blob).all

    render inertia: "Authors/Index", props: {
      authors: authors.map { |a|
        {
          full_name: a.full_name,
          avatar_url: a.avatar.attached? ? a.avatar.service.url(a.avatar.blob.key, transformation: [{ width: 250, height: 250 }]) : nil,
          books_count: a.books_count,
          permalink: author_path(a.slug),
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
      },
      books: author.books.map { |b| b.to_hash },
    }
  end
end
