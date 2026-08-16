class RenameEmailAdressToEmailInUsers < ActiveRecord::Migration[7.2]
  def change
    rename_column :users, :email_address, :email
  end
end
