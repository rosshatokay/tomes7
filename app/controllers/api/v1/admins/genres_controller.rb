class Api::V1::Admins::GenresController < Admins::BaseController
  def index
    render json: {
      genres: JSON.parse(Genre.all.to_json(only: [:name, :id])),
    }
  end

  def search
    results = Genre.where("name ILIKE ?", "%#{params[:q]}%")

    render json: {
      results: results,
    }
  end
end
