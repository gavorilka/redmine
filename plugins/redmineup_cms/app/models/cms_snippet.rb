# This file is a part of Redmin CMS (redmine_cms) plugin,
# CMS plugin for redmine
#
# Copyright (C) 2011-2024 RedmineUP
# http://www.redmineup.com/
#
# redmine_cms is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# redmine_cms is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with redmine_cms.  If not, see <http://www.gnu.org/licenses/>.

class CmsSnippet < defined?(ApplicationRecord) ? ApplicationRecord : ActiveRecord::Base
  include Redmine::SafeAttributes
  include RedmineupCms::Filterable

  attr_accessor :deleted_attachment_ids

  acts_as_attachable_cms
  acts_as_versionable_cms
  up_acts_as_taggable

  validates_presence_of :name, :content
  validates_format_of :name, :with => /\A(?!\d+$)[a-z0-9\-_]*\z/

  after_commit :expire_cache
  after_save :delete_selected_attachments  

  safe_attributes 'name',
                  'filter_id',
                  'description',
                  'tag_list',
                  'content'

  safe_attributes 'deleted_attachment_ids',
    :if => lambda {|snippet, user| snippet.attachments_deletable?(user)}

  scope :like, (lambda do |q|
    q = q.to_s
    if q.blank?
      where({})
    else
      pattern = "%#{sanitize_sql_like q}%"
      sql = +"LOWER(#{table_name}.name) LIKE LOWER(:p) ESCAPE :s"
      params = {:p => pattern, :s => '\\'}

      tokens = q.split(/\s+/).reject(&:blank?).map {|token| "%#{sanitize_sql_like token}%"}
      if tokens.present?
        sql << ' OR ('
        sql << tokens.map.with_index do |token, index|
          params[:"token_#{index}"] = token
          "(LOWER(#{table_name}.name) LIKE LOWER(:token_#{index}) ESCAPE :s )"
        end.join(' AND ')
        sql << ')'
      end
      where(sql, params)
    end
  end)

  def used_in_pages
    CmsPage.where("#{CmsPage.table_name}.content LIKE '%{% render_snippet '?' %}%'", name).order(:name)
  end

  def copy_from(arg)
    snippet = arg.is_a?(CmsSnippet) ? arg : CmsSnippet.where(:id => arg).first
    self.attributes = snippet.attributes.dup.except("id", "created_at", "updated_at") if snippet
    self
  end

  def visible?(user = User.current)
    RedmineupCms.allow_edit?(user)
  end

  def attachments_visible?(user = User.current)
    true
  end  

  def digest
    @generated_digest ||= digest!
  end

  def digest!
    Digest::MD5.hexdigest(content)
  end

  def deleted_attachment_ids
    Array(@deleted_attachment_ids).map(&:to_i)
  end

  def delete_selected_attachments
    if deleted_attachment_ids.present?
      objects = attachments.where(:id => deleted_attachment_ids.map(&:to_i))
      attachments.delete(objects)
    end
  end

  def expire_cache
    used_in_pages.includes(:parts).map(&:expire_cache)
    CmsPage.joins(:layout).where("#{CmsLayout.table_name}.content LIKE '%{% render_snippet '?' %}%'", name).map(&:expire_cache)
  end
end
