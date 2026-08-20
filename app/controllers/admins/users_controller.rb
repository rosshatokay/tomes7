class Admins::UsersController < Admins::BaseController
  include Pagy::Method

  def index
    users_scope = User.with_attached_avatar.includes(:sessions, :identities).all
    users_scope = apply_filters(users_scope)
    # @pagy, @users = pagy(users_scope, limit: 10)

    # @sort_option_groups = [
    #   {
    #     label: "Joined at",
    #     options: [["Newest first", "newest-first"], ["Earliest first", "earliest-first"]],
    #   },
    # ]

    render inertia: "Admin/Users", props: {
      users_count: users_scope.count,
      users: InertiaRails.defer {
        users_scope.map { |u|
          {
            id: u.hashid,
            avatar_url: u.get_avatar_url,
            username: u.username,
            email: u.email,
            provider: u.identities.first&.provider_name,
            last_session: u.sessions.sort_by(&:updated_at).last&.updated_at,
            created_at: u.created_at,
          }
        }
      },
    }
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
