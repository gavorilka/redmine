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

requires_redmineup version_or_higher: '1.0.5' rescue raise "\n\033[31mRedmine requires newer redmineup gem version.\nPlease update with 'bundle update redmineup'.\033[0m"

Redmine::Plugin.register :redmineup_cms do
  name 'Redmine CMS plugin'
  author 'RedmineUP'
  description 'This is a CMS plugin for Redmine'
  version '1.2.6'
  url 'https://redmineup.com/pages/plugins/cms'

  requires_redmine :version_or_higher => '4.0'

  settings :default => {
    "use_localization" => 1,
    "cache_expires" => 10,
    "default_layout" => '',
    'use_public_urls' => 0
  }

  permission :view_cms_pages, {:cms_pages => [:show]}, :public => true, :read => true
  permission :vote_cms_pages, {:cms_votes => [:vote]}, :public => true, :read => true

  project_module :cms do
    permission :view_project_tabs, {
      :project_tabs => [:show]
    }
    permission :manage_project_tabs, {
      :contacts_settings => :save
    }
  end

  Redmine::MenuManager.map :top_menu do |menu|
    #empty
  end

  delete_menu_item(:top_menu, :home)
  delete_menu_item(:top_menu, :"my_page")
  delete_menu_item(:top_menu, :projects)
  delete_menu_item(:top_menu, :help)
  delete_menu_item(:account_menu, :register)

  delete_menu_item(:project_menu, :activity)
  delete_menu_item(:project_menu, :overview)

  menu :top_menu, :cms, {:controller => 'cms_settings', :action => 'index'}, :first => true, :caption => :label_cms, :parent => :administration

  menu :admin_menu, :cms, {:controller => 'cms_settings', :action => 'index'}, :caption => :label_cms, :html => {:class => 'icon'}

  activity_provider :cms_content_versions, :default => false, :class_name => ['CmsContentVersion']
end

if (Rails.configuration.respond_to?(:autoloader) && Rails.configuration.autoloader == :zeitwerk) || Rails.version > '7.0'
  Rails.autoloaders.each { |loader| loader.ignore(File.dirname(__FILE__) + '/lib') }
else
  require_dependency 'redmine/menu'
end
require File.dirname(__FILE__) + '/lib/redmine/menu' if Redmine::VERSION.to_s >= '5.0.0'
require File.dirname(__FILE__) + '/lib/redmineup_cms'
CmsMenu.rebuild if ActiveRecord::Base.connection.table_exists?(:users) && ActiveRecord::Base.connection.table_exists?(:cms_menus)
