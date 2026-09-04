class Activity < ApplicationRecord
  include Hashid::Rails

  belongs_to :user
  belongs_to :subject, polymorphic: true

  scope :formatted, -> { includes(user: [avatar_attachment: :blob]).order(created_at: :desc).map { |activity| activity.to_hash } }

  def to_hash
    {
      user: {
        username: user.username,
        avatar_url: user.get_avatar_url,
      },
      action: action,
      subject: format_subject,
      created_at: created_at,
    }
  end

  def humanize_action
    return "added a review to" if action == "added_a_review"
    return "started reading" if action == "started_reading"

    # fallback
    action.humanize.downcase
  end

  def format_subject
    case action
    when "followed_an_author"
      subject.full_name
    when "saved_a_book", "started_reading"
      subject.title
    end
  end
end
