class Author < ApplicationRecord
  extend FriendlyId
  include Hashid::Rails

  friendly_id :full_name, use: :slugged

  acts_as_followable

  has_many :authorships, dependent: :destroy
  has_many :books, through: :authorships
  has_one_attached :avatar, service: :imagekit

  validates :full_name, presence: true
  validates :bio, presence: true
  validates :wiki_url, presence: true

  # We hook into the attachment process to prefix the key
  before_save :set_avatar_path, if: -> { avatar.attached? && avatar.attachment.blob.key.exclude?("/") }

  def get_avatar_url(size: 32)
    if avatar.attached?
      # .variant creates the resized version; .processed ensures it exists
      # .url generates the actual link
      avatar.service.url(avatar.blob.key, transformation: [{ width: size, height: size }])
    else
      nil
    end
  rescue
    # Fallback if processing fails
    DEFAULT_AVATARS[0]
  end

  def should_generate_new_friendly_id?
    full_name_changed? || super
  end

  private

  def set_avatar_path
    # We prepend the folder structure to the existing random key
    blob = avatar.blob
    blob.key = "#{Rails.env}/authors/avatars/#{blob.key}"
  end
end
