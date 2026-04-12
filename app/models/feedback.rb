class Feedback < ApplicationRecord
  include Hashid::Rails
  belongs_to :user

  before_validation :normalize_body
  validates :body, presence: true
  validates_length_of :body, maximum: 75, message: "too long"

  def formatted_subject
    "requested a book" if subject == "book_request"
  end

  private

  def normalize_body
    normalized = Sanitize.fragment(body, Sanitize::Config::RESTRICTED)

    if normalized.strip.empty?
      errors.add(:body, "cannot be empty after sanitization")
      throw(:abort) # Stops the save operation
    else
      self.body = normalized
    end
  end
end
