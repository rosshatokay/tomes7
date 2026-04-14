class AddCurrentPositionToUserBooks < ActiveRecord::Migration[7.2]
  def change
    add_column :user_books, :current_position, :string
  end
end
