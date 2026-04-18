module UsersHelper
  def follow_button(user)
    if Current.user.nil?
      return link_to "Follow", new_session_path(return_to: profile_path(user.username)), data: { turbo: false }, class: "btn btn-primary h-9"
    end

    if Current.user.follows?(user)
      button_to "Unfollow", unfollow_user_path(user.username), method: :post, data: { turbo_stream: true }, class: "btn btn-surface h-9"
    else
      button_to user.follows?(current_user) ? "Follow back" : "Follow", follow_user_path(user.username), method: :post, data: { turbo_stream: true }, class: "btn btn-primary h-9"
    end
  end

  def bottom_user_nav_links
    [
      { label: "Home", icon: "ph-house", path: root_path },
      { label: "Explore", icon: "ph-compass", path: explore_index_path },
      { label: "Saved", icon: "ph-heart", path: (user_signed_in? && current_user.onboarded?) ? saved_profile_path(current_user&.username) : new_session_path },
      { label: "Profile", icon: "ph-user", path: (user_signed_in? && current_user.onboarded?) ? profile_path(current_user&.username) : new_session_path },
    ]
  end
end
