class Admins::BaseController < ApplicationController
  before_action :ensure_admin_user

  # inertia_share do
  #   {
  #     auth: {
  #       admin: current_user&.admin? ? {
  #         id: current_user.id,
  #         email: current_user.email,
  #       } : nil,
  #     },
  #   }
  # end

  private

  def ensure_admin_user
    # Check the role on the User model instead of an Admin model
    unless Current.user&.admin?
      raise ActionController::RoutingError.new("Not Found")
    end
  end
end
