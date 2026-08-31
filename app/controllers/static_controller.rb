class StaticController < ApplicationController
  allow_unauthenticated_access

  def index
  end

  def about
    render inertia: "Static/About"
  end

  def terms
    render inertia: "Static/Article", props: {
      raw_article: File.read("lib/articles/terms.md"),
    }
  end

  def privacy
    render inertia: "Static/Article", props: {
      raw_article: File.read("lib/articles/privacy.md"),
    }
  end

  def community_guidelines
    render inertia: "Static/Article", props: {
      raw_article: File.read("lib/articles/community_guidelines.md"),
    }
  end
end
