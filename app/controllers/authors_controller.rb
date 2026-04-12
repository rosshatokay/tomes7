class AuthorsController < ApplicationController
  include Pagy::Method

  def show
    @author = Author.friendly.find(params[:id])
    @breadcrumbs = [{ label: "Home", path: root_path }, { label: "Authors", path: authors_path }, { label: @author.full_name }]
    @pagy, @books = pagy(@author.books, limit: 10)
  end
end
