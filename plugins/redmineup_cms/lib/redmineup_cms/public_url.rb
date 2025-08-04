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
  class PublicUrl
    class << self
      CMS_FOLDER = 'cms_files'.freeze

      def clear_cache
        cache_files = Dir.glob(Rails.public_path.join(CMS_FOLDER).join('*'))
        FileUtils.rm(cache_files)
      end

      def thumbnail_url(attachment, options)
        file_path = Rails.public_path.join(public_path(attachment, options))
        generate_thumbnail(file_path, attachment, options)

        options[:only_path] ? '/' + public_path(attachment, options) : public_url(attachment, options)
      end

      def asset_url(attachment, options)
        file_path = Rails.public_path.join(public_path(attachment, options))
        copy_attachment(file_path, attachment)

        options[:only_path] ? '/' + public_path(attachment, options) : public_url(attachment, options)
      end

      private

      def public_url(attachment, options = {})
        "#{Setting.protocol}://#{Setting.host_name}/#{public_path(attachment, options)}"
      end

      def public_path(attachment, options = {})
        Pathname.new(CMS_FOLDER).join(public_name(attachment, options)).to_s
      end

      def public_name(attachment, options = {})
        [cacheable_name(attachment), options[:size] || 100, attachment.filename].join('-')
      end

      def cacheable_name(attachment)
        Digest::MD5.hexdigest([attachment.id, attachment.digest, attachment.container.try(:updated_at)].join('#'))
      end

      def generate_thumbnail(path, attachment, options = {})
        return true if File.exists?(path)
        tpath = RedmineupCms::Thumbnail.generate(attachment, options)
        return false unless tpath

        directory = File.dirname(path)
        FileUtils.mkdir_p(directory) unless File.exists?(directory)
        FileUtils.cp(tpath, path)
        return true
      end

      def copy_attachment(path, attachment)
        return true if File.exists?(path)

        directory = File.dirname(path)
        FileUtils.mkdir_p(directory) unless File.exists?(directory)
        FileUtils.cp(attachment.diskfile, path)
        return true
      end
    end
  end
end
