module UsersHelper
  def bottom_user_nav_links
    [
      { label: "Home", icon: "ph-house", path: root_path },
      { label: "Explore", icon: "ph-compass", path: explore_index_path },
      { label: "Saved", icon: "ph-heart", path: (user_signed_in? && current_user.onboarded?) ? saved_profile_path(current_user&.username) : new_session_path },
      { label: "Profile", icon: "ph-user", path: (user_signed_in? && current_user.onboarded?) ? profile_path(current_user&.username) : new_session_path },
    ]
  end
end
