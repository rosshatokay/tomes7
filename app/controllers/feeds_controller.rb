class FeedsController < ApplicationController
  def index
    render inertia: "Feeds/Home", props: {
      currently_reading: current_user.currently_reading.map { |b| b.book.to_hash.merge({ permalink: book_path(b.book.slug) }) },
    }
  end
end
