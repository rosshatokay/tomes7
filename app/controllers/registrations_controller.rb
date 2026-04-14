class RegistrationsController < ApplicationController
  allow_unauthenticated_access
  rate_limit to: 10, within: 5.minutes, only: :create, with: -> { redirect_to new_registration_path, alert: "Try again later." }

  def new
    redirect_to root_path, alert: "Already signed in" if user_signed_in?
    @user = User.new
    @invited_by = User.find_by(username: params[:invited_by]) if params[:invited_by].present?
    session[:referrer_id] = @invited_by ? @invited_by.hashid : nil

    @seo_image_url = "/auth-splash.png"
    set_meta_tags(
      title: @invited_by ? "You've been invited to Tomes by #{@invited_by.username}" : "Join for free",
      description: @invited_by ? "You've been invited to Tomes by #{@invited_by.username} to read and review books for free." : "Join the Tomes Club for free to read and review books for free.",
      og: {
        title: :title,
        description: :description,
        site_name: "Tomes",
        url: new_registration_url,
        image: @seo_image_url,
      },
      twitter: {
        title: :title,
        description: :description,
        image: @seo_image_url,
        card: "summary",
      },
      reverse: true,
    )
  end

  def verify
    @breadcrumbs = [{ label: "Home", path: root_path }, { label: "Register", path: new_registration_path }, { label: "Verify" }]
  end

  def create
    return if user_signed_in?
    @user = User.new(user_params)

    if @user.save
      socialize_friends(session[:referrer_id], @user)
      session[:referrer_id] = nil
      start_new_session_for(@user)
      flash[:info] = "Successfully signed up"
      redirect_to onboarding_index_path
    else
      flash.now[:error] = "Something went wrong"
      render :new
    end
  end

  private

  def socialize_friends(inviter_id, new_user)
    inviter = User.find_by(id: User.decode_id(inviter_id))
    return unless inviter.present?

    inviter.follow!(new_user)
    new_user.follow!(inviter)

    Notifications::Notifier.accepted_invite(inviter: inviter, new_user: new_user)
    Notifications::Notifier.user_followed(follower: new_user, followed: inviter)
  end

  def user_params
    params.require(:user).permit(:email_address, :password, :password_confirmation, :username)
  end
end
