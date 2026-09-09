genres = [
  "Literature",
  "History",
  "Arts & Culture",
  "Religion & Philosophy",
  "Science & Technology",
  "Social Sciences & Society",
  "Lifestyle & Hobbies",
  "Health & Medicine",
  "Education & Reference",
]

genres.each do |name|
  Genre.find_or_create_by!(name: name)
end

user = User.find_or_initialize_by(username: "rusty", email: "rosshatokay@gmail.com", role: 1)
user.password = SecureRandom.hex
user.save!

if Rails.env.development?
  50.times do |i|
    User.create!(
      username: Faker::Internet.username(specifier: 5..12, separators: %w[_]),
      email: Faker::Internet.email,
      password: SecureRandom.hex,
    )
  end
end
