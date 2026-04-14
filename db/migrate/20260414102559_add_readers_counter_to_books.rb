class AddReadersCounterToBooks < ActiveRecord::Migration[7.2]
  def change
    add_column :books, :readers_count, :integer, default: 0
  end
end
