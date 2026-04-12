class Api::V1::TagsController < Admins::BaseController
  def index
    query = params[:q].to_s.downcase.strip

    tags = query.present? ? Tag.where("name ILIKE ?", "%#{query}%").limit(20) : Tag.limit(20)

    render json: tags.select(:id, :name)
  end
end
