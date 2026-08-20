class User < ApplicationRecord
  include Hashid::Rails

  MAX_FOLLOWABLE_AUTHORS_COUNT = 10
  ONBOARDING_STEP = :onboarding
  BLACKLISTED_USERNAMES = File.readlines(Rails.root.join("config", "blacklist.txt")).map do |line|
    line.strip.downcase
  end.reject { |line| line.empty? || line.start_with?("#") }.freeze
  DEFAULT_AVATARS = (1..90).map do |index|
    "https://ik.imagekit.io/kfg4bhruw/avatars/default_avatars/default-avatar-#{index}.png"
  end.freeze

  enum :role, { user: 0, admin: 1 }, default: :user

  has_secure_password

  acts_as_follower
  acts_as_followable
  acts_as_liker

  before_destroy :update_counters_on_deletion

  has_many :identities, dependent: :destroy
  has_many :feedbacks, dependent: :destroy
  has_many :notifications, dependent: :destroy
  has_many :ratings, dependent: :destroy
  has_many :rated_books, through: :ratings, source: :book
  has_many :user_books, dependent: :destroy
  has_many :books, through: :user_books
  has_many :sessions, dependent: :destroy
  has_many :activities, dependent: :destroy

  has_one_attached :avatar, service: :imagekit
  validates :avatar, content_type: [:png, :jpg, :jpeg, :avif, :webp], size: { less_than: 5.megabytes }

  before_save :set_avatar_path, if: -> { avatar.attached? && avatar.attachment.blob.key.exclude?("/") }

  validates :email, presence: true, uniqueness: true
  validates :username,
            # presence: { on: ONBOARDING_STEP },
            presence: true,
            uniqueness: true,
            format: { with: /\A[\w]+\z/, message: "only allows letters, numbers, and underscores", allow_blank: true },
            length: {
              minimum: 3,
              maximum: 20,
              message: "must be between 3 and 20 characters",
              allow_blank: true,
            },
            exclusion: {
              in: BLACKLISTED_USERNAMES,
              message: "not allowed",
            }
  validates :password, presence: true, length: { minimum: 8, message: "has to be at least 8 characters long" }, if: -> { password.present? }, allow_blank: true
  validate :maximum_authors_limit, on: :update

  def currently_reading
    user_books.includes(:book).order(updated_at: :desc).where("user_books.progress < 1").references(:book).merge(Book.published)
  end

  def onboarded?
    onboarded_at.present?
  end

  def handle
    "@#{username}"
  end

  def get_avatar_url(size: 32)
    if avatar.attached?
      # .variant creates the resized version; .processed ensures it exists
      # .url generates the actual link
      avatar.service.url(avatar.blob.key, transformation: [{ width: size, height: size }])
    else
      mod = (id - 1) % DEFAULT_AVATARS.length
      DEFAULT_AVATARS[mod]
    end
  rescue
    # Fallback if processing fails
    DEFAULT_AVATARS[0]
  end

  def update_counters_on_deletion
    # Update the friendship or follower counts for users connected to this user
    followees(User).each do |followee|
      followee.decrement!(:followers_count)
    end

    followers(User).each do |follower|
      follower.decrement!(:followees_count)
    end
  end

  private

  def set_avatar_path
    # We prepend the folder structure to the existing random key
    blob = avatar.blob
    blob.key = "#{Rails.env}/users/avatars/#{blob.key}"
  end

  def maximum_authors_limit
    if following(Author).count >= MAX_FOLLOWABLE_AUTHORS_COUNT
      errors.add(:base, "You cannot follow more than 10 authors.")
    end
  end
end
