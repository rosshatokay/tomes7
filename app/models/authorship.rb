class Authorship < ApplicationRecord
  belongs_to :book
  belongs_to :author, counter_cache: :books_count

  # So the same author can't be added twice
  validates :author_id, uniqueness: { scope: :book_id }

  after_create :increment_books_count
  after_destroy :decrement_books_count

  private

  def increment_books_count
    author.increment!(:books_count)
  end

  def decrement_books_count
    author.decrement!(:books_count)
  end
end
