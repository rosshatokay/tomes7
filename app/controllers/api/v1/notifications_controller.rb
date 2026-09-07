class Api::V1::NotificationsController < ApplicationController
  def index
    notifs = current_user.notifications.includes(notifiable: [avatar_attachment: :blob]).order(created_at: :desc).first(10)
    data = notifs.map { |n|
      n.update(read_at: Time.current)

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

    render json: data
  end

  def poll
    # maybe you can limit scope to `.last(10)` to mach the `index`
    unread_exists = current_user.notifications.unread.exists?

    render json: { unread_exists: unread_exists }, status: 200
  end

  private

  def get_permalink_based_on_kind(n)
    profile_path(n.notifiable.username) if n.kind == "user_followed" || n.kind == "accepted_invite"
  end
end
