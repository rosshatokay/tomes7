class RenameCategoryIdToGenreIdInBooks < ActiveRecord::Migration[7.2]
  def change
    rename_column :books, :category_id, :genre_id
  end
end
