class RegistrationsController < ApplicationController
  allow_unauthenticated_access

  def new
    render inertia: "Auth/Signup", props: {
      google_oauth_path: authorize_oauth_path,
    }
  end

  def create
    return if user_signed_in?
    user = User.new(user_params)

    if user.save
      # socialize_friends(session[:referrer_id], user)
      session[:referrer_id] = nil
      start_new_session_for(user)
      flash.inertia[:toast] = { description: "Signed up successfully" }
      redirect_to root_path
    else
      flash.inertia[:toast] = { description: "Something went wrong" }

      redirect_to registration_path, inertia: {
                                       errors: inertia_errors_for(user),
                                     }
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
    params.require(:user).permit(:email, :password, :username)
  end
end
