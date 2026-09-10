class StaticController < ApplicationController
  allow_unauthenticated_access

  def index
    books = Book.published.order(created_at: :desc).limit(8).map { |book| book.to_hash(permalink: book_path(book.slug)) }

    render inertia: "Static/Index", props: {
      featured_books: books,
    }
  end

  def about
    render inertia: "Static/About"
  end

  def terms
    render inertia: "Static/Article", props: {
      raw_article: File.read("lib/articles/terms.md"),
    }
  end

  def privacy
    render inertia: "Static/Article", props: {
      raw_article: File.read("lib/articles/privacy.md"),
    }
  end

  def community_guidelines
    render inertia: "Static/Article", props: {
      raw_article: File.read("lib/articles/community_guidelines.md"),
    }
  end
end
