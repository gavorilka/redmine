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

module Redmineup
  class CmsAttachmentDrop < Redmineup::Liquid::AttachmentDrop
    include ActionView::Helpers
    include Rails.application.routes.url_helpers

    def thumbnail_url(options = {})
      only_path = options.delete(:absolute).to_s != 'true'
      options[:token] = @attachment.token_sign if @attachment.visible?
      size = (options.delete(:size).to_s =~ /^(\d+|\d+x\d+)$/) ? $1 : 100

      if RedmineupCms.use_public_urls? && @attachment.public?
        return RedmineupCms::PublicUrl.thumbnail_url(@attachment, options.merge(host_options).merge({size: size, only_path: only_path}))
      end

      url_for({ controller: 'cms_assets', action: 'thumbnail', id: @attachment, filename: @attachment.filename, size: size, only_path: only_path }
              .merge(host_options)
              .merge(options))
    end

    def asset_url(options = {})
      only_path = options.delete(:absolute).to_s != 'true'
      options[:token] = @attachment.token_sign if @attachment.visible?
      if RedmineupCms.use_public_urls? && @attachment.public?
        return RedmineupCms::PublicUrl.asset_url(@attachment, options.merge(host_options).merge({ only_path: only_path }))
      end

      url_for({ controller: 'cms_assets', action: 'download', id: @attachment, filename: @attachment.filename, only_path: only_path }
              .merge(host_options)
              .merge(options))
    end

    def timelink_url(options = {})
      only_path = options.delete(:absolute).to_s != 'true'
      options[:token] = @attachment.token_sign if @attachment.visible?
      timestamp = options.delete(:expires).to_time rescue nil
      timestamp = Time.now + 10.minutes if timestamp.blank?

      url_for({ controller: 'cms_assets',
                action: 'timelink',
                id: @attachment,
                filename: @attachment.filename,
                timestamp: timestamp.utc.to_formatted_s(:number),
                key: RedmineupCms::Cryptor.generate_checksum(@attachment.id, timestamp.utc),
                only_path: only_path }
                .merge(host_options)
                .merge(options))
    end

    private

    def host_options
      { host: Setting.host_name, protocol: Setting.protocol }
    end
  end
end
