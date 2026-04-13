class AuthorsController < ApplicationController
  allow_unauthenticated_access
  include Pagy::Method

  def show
    @author = Author.includes(avatar_attachment: :blob).friendly.find(params[:id])
    @breadcrumbs = [{ label: "Home", path: root_path }, { label: "Authors", path: authors_path }, { label: @author.full_name }]
    @pagy, @books = pagy(@author.books, limit: 10)
    @author_avatar = @author.avatar.attached? ? @author.avatar.service.url(@author.avatar.blob.key, transformation: [{ width: 250, height: 250 }]) : nil

    set_meta_tags(
      title: "#{@author.full_name}",
      description: "Read #{@author.full_name}'s books on Tomes for free!",
      og: {
        title: :title,
        description: :description,
        site_name: "Tomes",
        url: author_url(@author.slug),
        image: @author_avatar,
      },
      twitter: {
        title: :title,
        description: :description,
        image: @author_avatar,
        card: "summary",
      },
      reverse: true,
    )
  end
end
