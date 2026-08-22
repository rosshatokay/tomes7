class Api::V1::Admins::AuthorsController < Admins::BaseController
  def search
    q = params[:q].to_s.strip.downcase
    authors = Author.includes(avatar_attachment: :blob).where("full_name ILIKE :q", q: "%#{q}%").limit(10)
    data = authors.map do |a|
      {
        id: a.id,
        full_name: a.full_name,
        avatar_url: a.get_avatar_url,
      }
    end

    render json: {
      results: data,
    }
  end

  def show
    author = Author.find(params[:id])

    render json: {
      author: {
        id: author.hashid,
        full_name: author.full_name,
        avatar_url: author.get_avatar_url(size: 100),
        bio: author.bio,
        wiki_url: author.wiki_url,
      },
    }
  end
end
