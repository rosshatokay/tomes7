class Activity < ApplicationRecord
  belongs_to :user
  belongs_to :subject, polymorphic: true

  def humanize_action
    return "added a review to" if action == "added_a_review"
    return "started reading" if action == "started_reading"

    # fallback
    action.humanize.downcase
  end
end
