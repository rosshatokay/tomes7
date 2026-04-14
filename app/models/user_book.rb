class UserBook < ApplicationRecord
  belongs_to :user
  belongs_to :book

  validates :progress, inclusion: { in: 0..1 }
  validates :user_id, uniqueness: { scope: :book_id, message: "already has this book in collection" }

  after_create { Book.increment_counter(:readers_count, book_id) }
  after_destroy { Book.decrement_counter(:readers_count, book_id) }
end
