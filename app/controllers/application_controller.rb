class ApplicationController < ActionController::Base
  include Pagy::Method
  include Authentication
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  # allow_browser versions: :modern

  helper_method :user_signed_in?
  helper_method :current_user
  helper_method :current_admin

  before_action :check_onboarding

  inertia_share auth: -> {
                  {
                    user: current_user&.as_json(
                      only: [
                        :email, :username, :full_name, :bio,
                      ],
                    )&.merge({
                      id: current_user&.hashid,
                      avatar_url: current_user&.get_avatar_url(size: 64),
                      is_admin: current_user&.admin?,
                    }),
                  }
                }

  unless Rails.env.production?
    around_action :n_plus_one_detection

    def n_plus_one_detection
      Prosopite.scan
      yield
    ensure
      Prosopite.finish
    end
  end

  def check_onboarding
    # Only redirect if they are logged in and haven't finished onboarding
    if authenticated? && !current_user.onboarded?
      redirect_to onboarding_index_path
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

  private

  def inertia_errors_for(record, object_name = nil)
    prefix = object_name || record.model_name.param_key

    record.errors.to_hash.transform_keys do |key|
      "#{prefix}.#{key}"
    end.transform_values(&:first)
  end

  def create_pagination(pagy)
    {
      current_page: pagy.page,
      next_page: pagy.next,
      prev_page: pagy.previous,
      total_pages: pagy.pages,
      total_count: pagy.count,
    }
  end

  def seo_tags(title: "", description: "", image: "")
    arr = []

    if title.present?
      arr << { title: title }
      arr << { proprety: "og:title", content: "#{title} – Tomes" }
    end

    if description.present?
      arr << { name: "description", content: description }
      arr << { property: "og:description", content: description }

      arr << { name: "twitter:description", content: description }
    end

    if image.present?
      arr << { property: "og:image", content: image }
      arr << { name: "twitter:image", content: image }
    end

    arr << { name: "twitter:card", content: "summary" }
    [
      { property: "og:site_name", content: "Tomes" },
      { property: "og:url", content: request.url },
    ].map { |item| arr << item }

    arr
  end
end
