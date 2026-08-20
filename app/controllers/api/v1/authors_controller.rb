class Api::V1::AuthorsController < Admins::BaseController
  def search
    q = params[:q].to_s.strip.downcase
    authors = Author.where("full_name ILIKE :q", q: "%#{q}%").limit(10)
    data = authors.map do |a|
      {
        id: a.hashid,
        full_name: a.full_name,
      }
    end

    render json: data
  end

  def show
    author = Author.find(params[:id])

    sleep 0.1
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
