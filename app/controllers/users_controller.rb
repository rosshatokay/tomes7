class UsersController < ApplicationController
  allow_unauthenticated_access
  before_action :find_user

  def show
    render inertia: "Users/Show", props: {
             user: @user_hash,
             books: @user.books.published.map { |b| b.to_hash },
           }, meta: seo_tags(
             title: @user.username,
             description: "Check #{@user.username}'s profile on Tomes.",
           )
  end

  def activity
    render inertia: "Users/Activity", props: {
      user: @user_hash,
      activities: @user.activities.formatted.first(10),
    }
  end

  def reviews
    render inertia: "Users/Reviews", props: {
      user: @user_hash,
      reviews: @user.ratings.formatted,
    }
  end

  private

  def find_user
    @user = User.with_attached_avatar.find_by!(username: params[:username])

    @user_hash = {
      username: @user.username,
      bio: @user.bio,
      avatar_url: @user.get_avatar_url(size: 200),
      is_current: @user.id === current_user&.id,
      share_url: profile_url(@user.username),
      is_followed: current_user&.follows?(@user),
      followers_count: @user.followers_count,
      followings_count: @user.followees_count,
    }
  end
end
