class Admins::DashboardController < Admins::BaseController
  layout "dashboard"

  def index
    @most_read_books = Book.all.with_attached_cover.includes(:authors).order(readers_count: :desc).first(5)
    @users_scope = User.where(created_at: get_range(params[:date_range]))
    @date_range_option_groups = [
      {
        label: "Date range",
        options: [["Last 7 days", "weekly"], ["Last 30 days", "monthly"]],
      },
    ]
  end

  private

  def get_range(date_range)
    case date_range
    when "weekly"
      7.days.ago..Time.current
    when "monthly"
      30.days.ago..Time.current
    else
      30.days.ago..Time.current
    end
  end
end
