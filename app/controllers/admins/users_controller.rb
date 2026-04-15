class Admins::UsersController < Admins::BaseController
  layout "dashboard"

  def index
    @users = User.with_attached_avatar.all
  end
end
