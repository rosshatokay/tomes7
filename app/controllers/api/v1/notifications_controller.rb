class Api::V1::NotificationsController < ApplicationController
  def index
    notifs = current_user.notifications.includes(:notifiable).order(created_at: :desc).last(10)
    data = notifs.map { |n|
      {
        kind: n.kind,
        created_at: n.created_at.localtime,
        notifier: n.notifiable.nil? ? nil : {
          avatar: n.notifiable.get_avatar_url,
          username: n.notifiable.username,
        },
        permalink: n.notifiable.nil? ? nil : get_permalink_based_on_kind(n),
      }
    }

    notifs.map { |n| n.update(read_at: Time.current) }

    render json: data
  end

  def poll
    unread_exists = current_user.notifications.unread.exists?

    render json: { unread_exists: unread_exists }, status: 200
  end

  private

  def get_permalink_based_on_kind(n)
    profile_path(n.notifiable.username) if n.kind == "user_followed" || n.kind == "accepted_invite"
  end
end
