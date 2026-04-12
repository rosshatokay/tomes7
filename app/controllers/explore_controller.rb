class ExploreController < ApplicationController
  allow_unauthenticated_access

  def index
    @breadcrumbs = [
      { label: "Home", path: root_path },
      { label: "Explore", path: explore_index_path },
    ]
  end
end
