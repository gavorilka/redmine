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
  STATUS_ACTIVE = 1
  STATUS_LOCKED = 0

  class << self
    def settings() Setting[:plugin_redmineup_cms].is_a?(Hash) ? Setting[:plugin_redmineup_cms] : {} end

    def cache_expires_in
      expires_in = self.settings['cache_expires_in'].to_i
      expires_in > 0 ? expires_in : 15
    end

    def use_localization?
      settings['use_localization'].to_i > 0
    end

    def layout_caching?
      settings['layout_caching'].to_i > 0
    end

    def default_layout
      settings['default_layout'].present? && CmsLayout.where(:id => settings['default_layout']).first
    end

    def error_page
      settings['error_page'].present? && CmsPage.find(settings['error_page'])
    end

    def allow_edit?(user=User.current)
      user_ids = [user.id] + user.groups.map(&:id)
      return true if user.admin?
      return true if user_ids.include?(settings['edit_permissions'].to_i) && user.logged?
      false
    end

    def landing_page
      return settings['landing_page'].to_i if settings['landing_page'].to_i > 0
    end

    def redirects
      settings['redirects'].is_a?(Hash) ? settings['redirects'] : settings['redirects'] = {}
    end

    def save_settings
      # cms_settings = settings
      # cms_settings = {} unless cms_settings.is_a?(Hash)
      # cms_settings.merge!(index => value)
      Setting.plugin_redmineup_cms = settings
    end

    def set_project_settings(name, project_id, _v)
      settings[:project] = { project_id => {} } unless settings[:project]
      settings[:project][project_id] = { name => '' } unless settings[:project][project_id]
      settings[:project][project_id][name] = _v if settings[:project][project_id]
      Setting[:plugin_redmineup_cms] = settings
    end

    def get_project_settings(name, project_id)
      settings[:project][project_id][name] if settings[:project] && settings[:project][project_id]
    end

    def default_page_fields
      settings['default_fields'].to_s.split(',').map(&:strip)
    end

    def view_layouts_base_html_head_hook
      settings['view_layouts_base_html_head_hook']
    end

    def view_layouts_base_sidebar_hook
      settings['view_layouts_base_sidebar_hook']
    end

    def view_layouts_base_body_bottom_hook
      settings['view_layouts_base_body_bottom_hook']
    end

    def use_public_urls?
      settings['use_public_urls'].to_i > 0
    end
  end

  module Layout
    LIST = %w(Default Redmine CMS None)

    class << self
      def layout_file_name(name)
        if name.blank?
          'base'
        else
          'cms_custom'
        end
      end

      def for_select(options = {})
        LIST.reject { |l| l == 'Default' && options[:for_settigns] }.map { |l| [l, l] }
      end
    end
  end
end

REDMINE_CMS_REQUIRED_FILES = [
  'acts_as_versionable_cms',
  'redmineup_cms/helpers/cms_helper',
  'redmineup_cms/patches/projects_helper_patch',
  'redmineup_cms/patches/application_helper_patch',
  'redmineup_cms/patches/menu_manager_patch',
  'redmineup_cms/patches/attachments_controller_patch',
  'redmineup_cms/patches/application_controller_patch',
  'redmineup_cms/patches/projects_controller_patch',
  'redmineup_cms/patches/welcome_controller_patch',
  'redmineup_cms/patches/attachment_patch',
  'redmineup_cms/patches/auto_completes_controller_patch',
  'redmineup_cms/hooks/views_layouts_hook',
  'redmineup_cms/wiki_macros/cms_wiki_macros',
  'redmineup_cms/textile/formatter',
  'redmineup_cms/acts_as_attachable_cms',
  'redmineup_cms/cryptor',
  'redmineup_cms/html_compressor',
  'redmineup_cms/javascript_filter',
  'redmineup_cms/page_finder',
  'redmineup_cms/page_nested_set',
  'redmineup_cms/sass_filter',
  'redmineup_cms/scss_filter',
  'redmineup_cms/text_filter',
  'redmineup_cms/textile_filter',
  'redmineup_cms/thumbnail',
]

REDMINE_CMS_REQUIRED_FILES << 'liquid' if Object.const_defined?("Liquid") rescue false

base_url = File.dirname(__FILE__)
REDMINE_CMS_REQUIRED_FILES.each { |file| require(base_url + '/' + file) }
