class AnalyticsService
  def self.most_read_books
    data = Book.all.with_attached_cover.includes(:authors).order(readers_count: :desc).first(5)

    data.map do |book|
      cover = book.cover.attached? ? book.cover.service.url(book.cover.blob.key, transformation: [{ width: 500 }]) : nil

      {
        cover: cover,
        title: book.title,
        author_names: book.author_names,
        readers_count: book.readers_count,
      }
    end
  end
end
