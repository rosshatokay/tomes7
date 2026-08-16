categories = [
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

categories.each do |name|
  Category.find_or_create_by!(name: name)
end

user = User.find_or_initialize_by(username: "rusty", email: "rosshatokay@gmail.com", role: 1)
user.password = SecureRandom.hex
user.save!
