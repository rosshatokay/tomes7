class Activities::Logger
  def self.started_reading(user:, book:)
    Activity.create!(
      user: user,
      subject: book,
      action: "started_reading",
    )
  end

  def self.added_a_review(user:, book:)
    Activity.create!(
      user: user,
      subject: book,
      action: "added_a_review",
    )
  end

  def self.saved_book(user:, book:)
    Activity.create!(
      user: user,
      subject: book,
      action: "saved_a_book",
    )
  end
end
