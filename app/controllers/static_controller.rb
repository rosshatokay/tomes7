class StaticController < ApplicationController
  allow_unauthenticated_access

  def index
    render inertia: "Static/Index", props: {
      categories: JSON.parse(Category.all.take(4).to_json(only: [:name, :slug])),
      books: InertiaRails.defer { Book.published.map { |b| b.to_hash.merge({ permalink: book_path(b.slug) }) } * 10 },
    }
  end
end
