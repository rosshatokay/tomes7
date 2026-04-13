class SearchService
  include ApplicationHelper

  def self.call(query)
    new(query).call
  end

  def initialize(query)
    @query = query.to_s.downcase.strip
  end

  def call
    results = book_results + author_results + category_results
    results.sort_by { |r| -r[:score] }
  end

  private

  attr_reader :query

  def category_results
    Category.where("name ILIKE ?", "%#{query}%").map do |category|
      {
        category: {
          name: category.name,
          icon: category_emoji(category.slug),
        },
        permalink: Rails.application.routes.url_helpers.category_path(category.slug),
        type: "category",
        score: score_match(category.name),
      }
    end
  end

  def book_results
    Book.where(published: true).where("title ILIKE ? OR ? <% title", "#{query}%", query).map do |book|
      {
        book: {
          title: book.title,
          cover: book.cover.attached? ? book.cover.service.url(book.cover.blob.key, transformation: [{ width: 100 }]) : nil,
          author_names: book.author_names,
        },
        type: "book",
        score: score_match(book.title),
        permalink: Rails.application.routes.url_helpers.book_path(book.slug),
      }
    end
  end

  def author_results
    Author.where("full_name ILIKE ? OR ? <% full_name", "#{query}%", query).map do |author|
      {
        author: {
          full_name: author.full_name,
          avatar: author.avatar.attached? ? author.avatar.service.url(author.avatar.blob.key, transformation: [{ width: 100 }]) : nil,
        },
        type: "author",
        score: score_match(author.full_name),
        permalink: Rails.application.routes.url_helpers.author_path(author.slug),
      }
    end
  end

  def score_match(text)
    text = text.downcase

    return 100 if text == query
    return 75 if text.start_with?(query)
    return 50 if text.include?(query)

    # fuzzy_search not enabled
    levenshetin_score(text)
  end

  def levenshetin_score(text)
    distance = levenshetin_distance(text, query)
    [0, 40 - distance].max
  end

  def levenshetin_distance(a, b)
    matrix = Array.new(a.length + 1) { |i| [i] }
    (0..b.length).each { |j| matrix[0][j] = j }

    (1..a.length).each do |i|
      (1..b.length).each do |j|
        cost = a[i - 1] == b[j - 1] ? 0 : 1
        matrix[i][j] = [
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost,
        ].min
      end
    end

    matrix[a.length][b.length]
  end
end
