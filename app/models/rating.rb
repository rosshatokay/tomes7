class Rating < ApplicationRecord
  belongs_to :user
  belongs_to :book, counter_cache: true

  after_create :update_book_score_sum
  after_destroy :update_book_score_sum
  after_update :update_book_score_sum

  validates :score, presence: true, inclusion: { in: 1..5, message: "can only be betwen 1 and 5" }
  validates :user_id, uniqueness: { scope: :book_id, message: "has already rated this book" }

  private

  def update_book_score_sum
    # This recalculates the sum of all scores for the book
    book.update_column(:sum_of_scores, book.ratings.sum(:score))
  end
end
