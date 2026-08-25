class AddDetailsToBooks < ActiveRecord::Migration[7.2]
  def change
    add_column :books, :details, :jsonb, default: {}, null: false
  end
end
