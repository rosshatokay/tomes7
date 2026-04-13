class OnboardingController < ApplicationController
  def index
    redirect_to root_path current_user.onboarded_at.present?
  end

  def update
    return if current_user.onboarded_at.present?

    if current_user.update(onboarding_params)
      socialize_friends(session[:referrer_id], current_user)
      current_user.update(onboarded_at: Time.now)
      flash[:success] = "You are all set!"
      redirect_to root_path
    else
      flash[:error] = "Something went wrong"
      render :index
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
