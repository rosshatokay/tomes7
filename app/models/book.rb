class Book < ApplicationRecord
  self.ignored_columns = [:toc]

  acts_as_likeable

  include Hashid::Rails
  extend FriendlyId
  friendly_id :title, use: :slugged

  has_many :authorships, dependent: :destroy
  has_many :authors, through: :authorships
  has_many :taggings, dependent: :destroy
  has_many :tags, through: :taggings
  has_many :ratings, dependent: :destroy
  has_many :raters, through: :ratings, source: :user
  has_many :user_books
  has_many :readers, through: :user_books, source: :user

  has_one_attached :cover, service: :imagekit
  has_one_attached :epub, service: Rails.env.production? ? :amazon_prod : :amazon_dev

  belongs_to :category

  accepts_nested_attributes_for :authorships, allow_destroy: true

  validates :title, presence: true
  validates :description, presence: true
  validates :epub, content_type: ["application/epub+zip"], size: { less_than: 100.megabytes }

  scope :published, -> { includes(:category, :authors, cover_attachment: [:blob]).where(published: true) }

  before_save :set_cover_path, if: -> { cover.attached? && cover.attachment.blob.key.exclude?("/") }

  def author_names
    authors.map { |a| a.full_name }.join(", ")
  end

  def toc
    BookWithToc.find(id).toc
  end

  def average_rating
    return 0.0 if ratings_count.zero?

    (sum_of_scores.to_f / ratings_count).round(2)
  end

  def similar_books(limit = 8)
    ids = tag_ids
    return Book.none if ids.empty?

    Book.with_attached_cover
      .preload(:category, :authors)
      .joins(:taggings)
      .where(taggings: { tag_id: ids })
      .where.not(id: id)
      .group(:id)
      .order(Arel.sql("COUNT(*) DESC"))
      .limit(limit)
  end

  def should_generate_new_friendly_id?
    title_changed? || super
  end

  def rated_by?(user)
    raters.exists?(id: user&.id)
  end

  def rating_by(user)
    ratings.where(user_id: user.id)&.first
  end

  def tag_names=(input)
    # Accept string or array
    names = Array(input)

    # Normalize and clean up the names
    normalized_names = names.map { |n| n.to_s.strip.downcase }.reject(&:blank?).uniq

    # Batch lookup
    existing_tags = Tag.where(name: normalized_names).pluck(:name)

    # Tags to create
    tags_to_create = normalized_names - existing_tags

    # Create missing tags in bulk
    Tag.create!(tags_to_create.map { |name| { name: name } })

    # Find all tags (existing + newly created)
    tag_list = Tag.where(name: normalized_names).uniq

    self.tags = tag_list
  end

  def tag_names
    tags.pluck(:name).join(", ")
  end

  def to_param
    hashid
  end

  private

  def set_cover_path
    # We prepend the folder structure to the existing random key
    blob = cover.blob
    blob.key = "books/covers/#{blob.key}"
  end
end
