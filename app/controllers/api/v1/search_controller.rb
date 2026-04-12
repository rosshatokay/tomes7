class Api::V1::SearchController < ApplicationController
  allow_unauthenticated_access

  def index
    results = SearchService.call(params[:q])

    render json: results
  end
end
