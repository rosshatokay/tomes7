module ActivitiesHelper
  def activity_bg_icon(action:)
    return { bg: "bg-indigo-500 text-white", icon: "ph-book-open" } if action == "started_reading"
    return { bg: "bg-amber-500 text-white", icon: "ph-star" } if action == "added_a_review"
    return { bg: "bg-blue-500 text-white", icon: "ph-heart" } if action == "saved_a_book"

    nil
  end
end
