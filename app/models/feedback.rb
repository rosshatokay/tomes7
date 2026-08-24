class Feedback < ApplicationRecord
  include Hashid::Rails
  belongs_to :user

  enum :feedback_type, { book_request: 0, bug_report: 1, general: 2 }

  attribute :book_title, :string
  attribute :author_name, :string

  before_validation :normalize_body
  validates :body, presence: true
  validates_length_of :body, maximum: 300, message: "too long"

  def formatted_subject
    "requested a book" if subject == "book_request"
  end

  def self.build_book_request(user, book_title:, author_name:)
    user.feedbacks.build(
      feedback_type: :book_request,
      subject: "[BOOK REQUEST]",
      body: "Requested #{book_title} by #{author_name}",
    )
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
