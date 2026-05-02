class Admins::ActivitiesController < Admins::BaseController
  include Pagy::Method
  layout "dashboard"

  def index
    scope = Activity.includes(:subject, user: [avatar_attachment: :blob]).all
    # scope = apply_filters(scope)
    @pagy, @activities = pagy(scope.order(created_at: :desc), limit: 10)
  end

  private

  def apply_filters(scope)
    scope = apply_sort(scope)
    # scope = apply_provider_filter(scope)
    scope
  end

  def apply_sort(scope)
    case params[:joined_at]
    when "newest-first"
      scope.order(created_at: :desc)
    when "earliest-first"
      scope.order(created_at: :asc)
    else
      scope
    end
  end
end
