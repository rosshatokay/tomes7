class Api::V1::Admins::CategoriesController < ApplicationController
  def index
    render json: {
      categories: JSON.parse(Category.all.to_json(only: [:name, :id])),
    }
  end

  def search
    results = Category.where("name ILIKE ?", "%#{params[:q]}%")

    render json: {
      results: results,
    }
  end
end
