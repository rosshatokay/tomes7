class Activity < ApplicationRecord
  include Hashid::Rails

  belongs_to :user
  belongs_to :subject, polymorphic: true

  def humanize_action
    return "added a review to" if action == "added_a_review"
    return "started reading" if action == "started_reading"

    # fallback
    action.humanize.downcase
  end

  def format_subject
    case action
    when "followed_an_author"
      {
        label: subject.full_name,
      }
    end
  end
end
