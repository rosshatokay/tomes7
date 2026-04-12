Imagekit::Rails.configure do |config|
  config.url_endpoint = ENV["IMAGEKIT_URL_ENDPOINT"]
  config.public_key = ENV["IMAGEKIT_PUBLIC_KEY"]
  config.private_key = ENV["IMAGEKIT_PRIVATE_KEY"]
end
