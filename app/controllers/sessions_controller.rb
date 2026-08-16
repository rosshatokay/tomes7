class SessionsController < ApplicationController
  allow_unauthenticated_access only: %i[ new create ]
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> { redirect_to new_session_path, alert: "Try again later." }

  def new
    redirect_to root_path, alert: "Already signed in" if user_signed_in?

    render inertia: "Auth/Login"
  end

  def create
    return if user_signed_in?

    if user = User.authenticate_by(params.permit(:email, :password))
      start_new_session_for user
      redirect_to(safe_return_to(params[:return_to]) || root_path)
    else
      redirect_to new_session_path, inertia: {
                                      errors: { email: "Invalid email address or password." },
                                    }
    end
  end

  def destroy
    terminate_session
    redirect_to root_path, status: :see_other
  end

  private

  def safe_return_to(path)
    # presence check
    return nil if path.blank?

    # prevent open redirects
    return nil unless path.start_with?("/") && !path.start_with?("//") && !path.start_with?("/\\")

    begin
      # URI parsing to ensure it's a valid path structure
      uri = URI.parse(path)

      # only want the path and the query/fragment, no host/scheme
      return nil if uri.host || uri.scheme

      # strict route recognition
      Rails.application.routes.recognize_path(uri.path)

      path
    rescue URI::InvalidURIError, ActionController::RoutingError => e
      puts "could not return user to path after sign in: #{e}"
      nil
    end
  end
end
