class Api::V1::Admins::TagsController < Admins::BaseController
  def search
    query = params[:q].to_s.downcase.strip

    tags = query.present? ? Tag.where("name ILIKE ?", "%#{query}%").limit(20) : Tag.limit(20)

    render json: {
      results: tags.select(:id, :name),
    }
  end
end
