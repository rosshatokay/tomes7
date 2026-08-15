class ApplicationController < ActionController::Base
  include Authentication
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  # allow_browser versions: :modern

  helper_method :user_signed_in?
  helper_method :current_user
  helper_method :current_admin

  inertia_share auth: -> {
                  {
                    user: current_user&.as_json(
                      only: [
                        :email, :username, :full_name,
                      ],
                    )&.merge({
                      id: current_user&.hashid,
                      avatar_url: current_user&.avatar_url,
                    }),
                  }
                }

  before_action :check_onboarding

  def check_onboarding
    # Only redirect if they are logged in and haven't finished onboarding
    if authenticated? && !current_user.onboarded?
      redirect_to onboarding_index_path
    end
  end

  unless Rails.env.production?
    around_action :n_plus_one_detection

    def n_plus_one_detection
      Prosopite.scan
      yield
    ensure
      Prosopite.finish
    end
  end

  before_action do
    if current_user && current_user.admin?
      # Rack::MiniProfiler.authorize_request
    end
  end

  def current_user
    @current_user ||= Current.user
  end

  def user_signed_in?
    current_user.present?
  end

  def current_admin
    @current_admin ||= Current.user unless !Current.user&.admin?
  end
end
