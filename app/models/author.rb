class Author < ApplicationRecord
  extend FriendlyId
  include Hashid::Rails

  friendly_id :full_name, use: :slugged

  has_many :authorships, dependent: :destroy
  has_many :books, through: :authorships
  has_one_attached :avatar, service: :imagekit

  # We hook into the attachment process to prefix the key
  before_save :set_avatar_path, if: -> { avatar.attached? && avatar.attachment.blob.key.exclude?("/") }

  private

  def set_avatar_path
    # We prepend the folder structure to the existing random key
    blob = avatar.blob
    blob.key = "authors/avatars/#{blob.key}"
  end
end
