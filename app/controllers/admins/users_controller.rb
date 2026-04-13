class Admins::UsersController < Admins::BaseController
  layout "dashboard"

  def index
    @users = User.all
  end
end
