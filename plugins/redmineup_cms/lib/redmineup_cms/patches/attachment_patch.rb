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

module RedmineupCms
  module Patches
    module AttachmentPatch
      def self.included(base)
        base.send(:include, InstanceMethods)

        base.class_eval do
          alias_method :project_without_cms, :project
          alias_method :project, :project_with_cms
          alias_method :container_without_cms, :container
          alias_method :container, :container_with_cms
          alias_method :thumbnail_without_cms, :thumbnail
          alias_method :thumbnail, :thumbnail_with_cms
          alias_method :'visible?_without_cms', :'visible?'
          alias_method :'visible?', :'visible?_with_cms'
        end
      end

      module InstanceMethods
        def container_with_cms
          return CmsSite.instance if container_type == 'CmsSite'
          container_without_cms
        end

        def project_with_cms
          if container.respond_to?(:project)
            container.try(:project)
          else
            Project.new
          end
        end

        def thumbnail_with_cms(options = {})
          if thumbnailable? && readable?
            size = options[:size].to_i
            size = Setting.thumbnails_size.to_i unless size > 0
            size = 100 unless size > 0
            target = File.join(self.class.thumbnails_storage_path, "#{id}_#{digest}_#{size}.thumb")

            begin
              Redmine::Thumbnail.generate(diskfile, target, size, is_pdf?)
            rescue => e
              logger.error "An error occured while generating thumbnail for #{disk_filename} to #{target}\nException was: #{e.message}" if logger
              nil
            end
          end
        end

        def token_sign(user = User.current)
          Digest::SHA256.hexdigest([user.try(:id), self.digest].join(';'))
        end

        def token_auth(token, user = User.current)
          token_sign(user) == token
        end

        define_method 'visible?_with_cms' do |user = User.current|
          if container_id
            Rails.cache.fetch([user.id, container_id, container_type], :expires_in => 1.minute) do
              container && container.attachments_visible?(user)
            end
          else
            send('visible?_without_cms', user)
          end
        end

        def public?
          return true if container.is_a?(CmsSite)

          (container.respond_to?(:active) ? container.active? : true) &&
            (container.respond_to?(:public?) ? container.public? : true)
        end
      end
    end
  end
end

unless Attachment.included_modules.include?(RedmineupCms::Patches::AttachmentPatch)
  Attachment.send(:include, RedmineupCms::Patches::AttachmentPatch)
end
