class Admins::ActivitiesController < Admins::BaseController
  def index
    scope = Activity.includes(:subject, user: [avatar_attachment: :blob]).all
    scope = apply_filters(scope)
    @pagy, activities = pagy(scope.order(created_at: :desc), limit: 10)

    render inertia: "Admin/Activities", props: {
      activities: InertiaRails.defer {
        activities.map { |a|
          {
            id: a.hashid,
            user: {
              avatar_url: a.user.get_avatar_url(size: 32),
              username: a.user.username,
            },
            action: a.action,
            subject: a.format_subject,
            created_at: a.created_at.localtime,
          }
        }
      },
      pagination: create_pagination(@pagy),
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
      scope
    end
  end
end
