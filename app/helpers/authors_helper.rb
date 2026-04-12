module AuthorsHelper
  def avatar_url(author)
    return unless author.avatar.attached?

    path = Rails.application.routes.url_helpers.rails_blob_path(
      author.avatar,
      only_path: true,
    )

    # Imagekit
  end
end
