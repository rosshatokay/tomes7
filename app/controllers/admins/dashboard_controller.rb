class Admins::DashboardController < Admins::BaseController
  # layout "dashboard"

  def index
    active_users_count = ->(range) {
      Session.where(created_at: range)
        .distinct(:user_id)
        .count(:user_id)
    }

    render inertia: "Admin/Dashboard", props: {
      charts: {
        overview: [
          {
            label: "Registrations",
            period_label: Time.now.strftime("%B %Y"),
            current: User.where(created_at: 1.month.ago..Time.current).count,
            previous: User.where(created_at: 2.months.ago..1.month.ago).count,
          },
          {
            label: "Books added",
            period_label: Time.now.strftime("%B %Y"),
            current: Book.where(created_at: 1.months.ago..Time.current).count,
            previous: Book.where(created_at: 2.months.ago..1.months.ago).count,
          },
          {
            label: "DAU",
            period_label: "This week",
            current: active_users_count.call(7.days.ago..Time.current),
            previous: active_users_count.call(14.days.ago..7.days.ago),
          },
        ],
        registrations: get_registartions_chart_data,
      },
    }
  end

  private

  def get_range(date_range)
    case date_range
    when "weekly"
      7.days.ago..Time.current.to_date
    when "monthly"
      30.days.ago..Time.current.to_date
    else
      7.days.ago..Time.current.to_date
    end
  end

  def get_registartions_chart_data
    # 1. Define the 12-month date range
    start_date = 11.months.ago.beginning_of_month
    end_date = Time.current.end_of_month

    # 2. Fetch all registrations in a single database query grouped by month
    # Note: postgres syntax used for grouping. For MySQL, use "DATE_FORMAT(created_at, '%Y-%m-01')"
    monthly_counts = User.where(created_at: start_date..end_date)
                         .group("DATE_TRUNC('month', created_at)")
                         .count

    # 3. Generate the 12-month array and map the query results onto it
    (0..11).map do |i|
      month_start = i.months.ago.beginning_of_month.to_date

      # Match database timestamp keys by casting them to Date objects
      db_key = monthly_counts.keys.find { |k| k&.to_date == month_start }
      count = db_key ? monthly_counts[db_key] : 0

      {
        month: month_start.strftime("%B %Y"),
        registrations: count,
      }
    end.reverse
  end
end
