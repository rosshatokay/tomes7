class AddFollowersCountToAuthors < ActiveRecord::Migration[7.2]
  def change
    add_column :authors, :followers_count, :integer, default: 0
  end
end
