class UsersController < ApplicationController
  allow_unauthenticated_access

  def show
    user = User.find_by!(username: params[:username])

    render inertia: "Users/Show", props: {
      user: {
        username: user.username,
        bio: user.bio,
        avatar_url: user.get_avatar_url(size: 200),
      },
    }
  end
end
