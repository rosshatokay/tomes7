class FeedsController < ApplicationController
  def library
    available_tabs = ["reading", "following", "saved"]
    if params[:tab].present? && !available_tabs.include?(params[:tab])
      redirect_to library_path(tab: "reading")
      return
    end
    current_tab = params[:tab].presence || "reading"

    books = case current_tab
      when "reading"
        current_user.currently_reading.map { |b| b.book.to_hash.merge({ permalink: book_path(b.book.slug) }) }
      when "following"
        []
        # Book.includes(:authors, cover_attachment: [:blob]).all.map { |b| b.to_hash.merge({ permalink: book_path(b.slug) }) }
      when "saved"
        []
        current_user.likees(Book.includes(:authors, cover_attachment: :blob)).map { |b| b.to_hash }
      else
        current_user.currently_reading.map { |b| b.book.to_hash.merge({ permalink: book_path(b.book.slug) }) }
      end

    render inertia: "Feeds/Library", props: {
      books: books,
    }
  end

  def community
    render inertia: "Feeds/Community", props: {
      posts: Rating.includes(book: [:authors, cover_attachment: :blob], user: [avatar_attachment: :blob]).all.map { |r| r.to_community },
    }
  end

  private

  def fake_posts
    results = []

    5.times do
      user = User.includes(avatar_attachment: :blob).all.shuffle.first

      results << {
        user: {
          username: user.username,
          avatar_url: user.get_avatar_url,
        },
        post: {
          content: "A somewhat disappointing follow up after years of waiting. It lacks the naïveté and theatricality of her last two albums, instead opting for a consistently more somber tone that works against the rather simple and at times amateurish lyricism that she hasn’t really changed. While that lyricism previously had a certain charm and strong emotional pull, the production surrounding it here makes the whole thing feel like a bland Elliott Smith/Sun Kil Moon imitation, without the solid writing needed to carry it.",
        },
      }
    end

    results
  end
end
