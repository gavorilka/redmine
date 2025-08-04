class MigrateTag < ActiveRecord::Base
    self.table_name = 'tags'
    has_many :migrate_taggings, dependent: :destroy, foreign_key: :tag_id, inverse_of: :migrate_tag
    # validates_format_of :name, :with => /^[A-Za-z0-9.&]*\z/, :maximum => 10, inverse_of: :migrate_tag
    
end