class SettingsController < ApplicationController
  def index
    @breadcrumbs = [{ label: "Home", path: root_path }, { label: "Settings" }]

    meta("Settings")
  end

  def preferences
    @breadcrumbs = [{ label: "Home", path: root_path }, { label: "Settings", path: settings_path }, { label: "Preferences" }]

    meta("Preferences")
  end

  def profile
    if current_user.update(profile_params)
      flash[:success] = "Changes saved"
      redirect_to settings_path
    else
      flash[:error] = "Something went wrong"
      render :index
    end
  end

  private

  def meta(title)
    set_meta_tags(
      title: title,
      reverse: true,
      noindex: true,
    )
  end

  def profile_params
    params.require(:user).permit(:avatar, :bio)
  end
end
