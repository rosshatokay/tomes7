class Admins::UsersController < Admins::BaseController
  include Pagy::Method
  layout "dashboard"

  def index
    users_scope = User.with_attached_avatar.includes(:sessions, :identities).all
    users_scope = apply_filters(users_scope)
    @pagy, @users = pagy(users_scope, limit: 10)

    @sort_option_groups = [
      {
        label: "Joined at",
        options: [["Newest first", "newest-first"], ["Earliest first", "earliest-first"]],
      },
    ]
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
      scope.order(created_at: :desc)
    end
  end
end
