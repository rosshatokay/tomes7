class CategoriesController < ApplicationController
  def show
    render inertia: "Category/Show", props: {}
  end
end
