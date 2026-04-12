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
end
