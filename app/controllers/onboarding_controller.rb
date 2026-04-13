class OnboardingController < ApplicationController
  skip_before_action :check_onboarding

  def index
    if current_user.onboarded?
      redirect_to root_path and return
    end
  end

  def update
    # Guard clause to prevent re-onboarding
    return redirect_to root_path if current_user.onboarded?

    # 1. Assign the params without saving yet
    current_user.assign_attributes(onboarding_params)

    # 2. Set the timestamp (it will be saved along with the username)
    current_user.onboarded_at = Time.current

    # 3. Save using the :onboarding context to trigger the username presence check
    if current_user.save(context: :onboarding)
      socialize_friends(session[:referrer_id], current_user)
      flash[:success] = "You are all set!"
      redirect_to root_path
    else
      # flash[:error] isn't strictly necessary if you display @user.errors in your view
      flash.now[:error] = "Please fix the errors below"
      render :index, status: :unprocessable_entity
    end
  end

  private

  def socialize_friends(inviter_id, new_user)
    inviter = User.find_by(id: User.decode_id(inviter_id))
    return unless inviter.present?
    return if inviter == new_user

    inviter.follow!(new_user)
    new_user.follow!(inviter)

    Notifications::Notifier.accepted_invite(inviter: inviter, new_user: new_user)
    Notifications::Notifier.user_followed(follower: new_user, followed: inviter)

    session[:referrer_id] = nil
  end

  def onboarding_params
    params.require(:user).permit(:username, :avatar)
  end
end
