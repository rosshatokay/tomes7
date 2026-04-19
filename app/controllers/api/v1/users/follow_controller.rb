class Api::V1::Users::FollowController < ApplicationController
  def index
    render json: { errors: ["You need an account to perform this action"] }, status: :unprocessable_entity if !user_signed_in? and return
    user = User.find_by(username: params[:username])
    user_is_followed = current_user.follows?(user)

    if user_is_followed
      unfollow(user)
    else
      follow(user)
    end

    user_is_followed = !user_is_followed

    render json: {
             is_following: user_is_followed,
             message: user_is_followed ?
               "You started following #{user.username}" : "You stopped following #{user.username}",
             success: true,
           }, status: :ok
  end

  private

  def follow(user)
    current_user.follow!(user)
    # Notifications::Notifier.user_followed(follower: current_user, followed: user)
  end

  def unfollow(user)
    current_user.unfollow!(user)
  end
end
