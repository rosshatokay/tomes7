class Genre < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: :slugged

  has_many :popular_books, -> { limit(8) }, class_name: "Book"
  has_many :books

  def format(permalink:)
    {
      name: name,
      slug: slug,
      permalink: permalink,
    }
  end
end
