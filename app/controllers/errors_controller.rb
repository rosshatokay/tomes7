class ErrorsController < ApplicationController
  allow_unauthenticated_access

  def show
  end

  def not_found
    @status = 404
    @heading = "Oops! This page doesn't exist"
    @description = "The page you are looking for doesn't exist or may have been moved."
    render :show, status: 404
  end

  def internal_server_error
    @status = 500
    @heading = "Something went wrong!"
    @description = "Looks like something went awry on our end. Try refreshing the page."
    render :show, status: 500
  end

  def unprocessable
    @status = 422
    @heading = "Something went wrong!"
    @description = "Looks like something went awry on our end. Try refreshing the page."
    render :show, status: 422
  end
end
