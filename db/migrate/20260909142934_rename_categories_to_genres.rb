class RenameCategoriesToGenres < ActiveRecord::Migration[7.2]
  def change
    rename_table :categories, :genres
  end
end
