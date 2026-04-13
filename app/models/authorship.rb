class Authorship < ApplicationRecord
  belongs_to :book
  belongs_to :author, counter_cache: :books_count

  # So the same author can't be added twice
  validates :author_id, uniqueness: { scope: :book_id }
end
