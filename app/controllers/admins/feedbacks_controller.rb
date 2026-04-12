class Admins::FeedbacksController < Admins::BaseController
  include Pagy::Method
  layout "dashboard"

  def index
    f_scope = Feedback.includes(:user).all.order(created_at: :desc)
    @pagy, @feedbacks = pagy(f_scope, limit: 10)
  end

  def show
    @feedback = Feedback.find(params[:id])
    @breadcrumbs = [{ label: "Home", path: root_path }, { label: "Feedbacks", path: admins_feedbacks_path }, { label: "##{@feedback.hashid}" }]
  end
end
