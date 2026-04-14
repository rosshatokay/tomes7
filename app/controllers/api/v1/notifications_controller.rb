class Api::V1::NotificationsController < ApplicationController
  def index
    data = current_user.notifications.includes(:notifiable).order(created_at: :desc).last(10).map { |n|
      {
        kind: n.kind,
        created_at: n.created_at.localtime,
        notifier: n.notifiable.nil? ? nil : {
          avatar: n.notifiable.get_avatar,
          username: n.notifiable.username,
        },
        permalink: n.notifiable.nil? ? nil : get_permalink_based_on_kind(n),
      }
    }

    render json: data
  end

  private

  def get_permalink_based_on_kind(n)
    profile_path(n.notifiable.username) if n.kind == "user_followed" || n.kind == "accepted_invite"
  end
end
