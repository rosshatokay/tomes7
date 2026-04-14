class Notifications::Notifier
  # def self.book_liked(book:, actor)

  def self.user_followed(follower:, followed:)
    return if follower == followed

    Notification.create!(
      kind: "user_followed",
      notifiable: follower, # who triggered it
      user: followed,
    )

    ActionCable.server.broadcast("notifications_#{followed.id}", { unread_messages: true })
  end

  def self.accepted_invite(inviter:, new_user:)
    Notification.create!(
      kind: "accepted_invite",
      notifiable: new_user,
      user: inviter,
    )

    ActionCable.server.broadcast("notifications_#{inviter.id}", { unread_messages: true })
  end
end
