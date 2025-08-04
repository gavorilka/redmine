class RemoveIndexTags < ActiveRecord::Migration[5.2]
  def change
    change_column :tags, :name, :string,  unique: false
    #Ex:- change_column("admin_users", "email", :string, :limit =>25)
  end
end
