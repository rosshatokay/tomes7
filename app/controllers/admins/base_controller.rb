class Admins::BaseController < ApplicationController
  before_action :ensure_admin_user

  private

  def ensure_admin_user
    # Check the role on the User model instead of an Admin model
    unless Current.user&.admin?
      raise ActionController::RoutingError.new("Not Found")
    end
  end
end
