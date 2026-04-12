class UsersController < ApplicationController
  include Pagy::Method

  allow_unauthenticated_access only: %i[ show ]
  before_action :find_user

  def show
    @breadcrumbs = [{ label: "Home", path: root_path }, { label: @user.handle }]
    @activities = @user.activities.includes(:subject).order(created_at: :desc).first(5)

    set_meta_tags(
      title: "#{@user.username}'s profile",
      description: "Follow #{@user.username} on Tomes",
      reverse: true,
    )
  end

  def reviews
    @breadcrumbs = [{ label: "Home", path: root_path }, { label: @user.handle, path: profile_path(@user.username) }, { label: "Reviews" }]
  end

  def saved
    @breadcrumbs = [{ label: "Home", path: root_path }, { label: @user.handle, path: profile_path(@user.username) }, { label: "Saved" }]
    @pagy, @saved_books = pagy(@user.likees(Book).includes(:authors, :cover_attachment), limit: 10)

    set_meta_tags(
      title: "#{@user.username}'s saved books",
      description: "Check out #{@user.username}'s saved books on Tomes",
      reverse: true,
    )

    respond_to do |format|
      format.html
      format.turbo_stream
    end
  end

  def follow
    current_user.follow!(@user)

    Notifications::Notifier.user_followed(follower: current_user, followed: @user)

    respond_to do |format|
      format.turbo_stream {
        render turbo_stream: turbo_stream.replace(helpers.dom_id(@user, :follow_button), partial: "users/follow_button", locals: { user: @user })
      }
      format.html { redirect_to @user }
    end
  end

  def unfollow
    current_user.unfollow!(@user)

    respond_to do |format|
      format.turbo_stream {
        render turbo_stream: turbo_stream.replace(helpers.dom_id(@user, :follow_button), partial: "users/follow_button", locals: { user: @user })
      }
      format.html { redirect_to @user }
    end
  end

  private

  def find_user
    @user = User.find_by!(username: params[:username])
  end
end
