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

REQUIRED_DROP_FILES_REDMINE_CMS = [
  'liquid/drops/base_drop',
  'liquid/drops/cms_attachment_drop',
  'liquid/drops/menus_drop',
  'liquid/drops/pages_drop',
  'liquid/drops/parts_drop',
  'liquid/drops/request_drop',
  'liquid/drops/site_drop',

  'liquid/filters/cms_arrays',
  'liquid/filters/cms_base',
  'liquid/filters/cms_pages',
  'liquid/filters/drops',
  'liquid/filters/html',
  'liquid/filters/locale',
  'liquid/filters/pagination',
  'liquid/filters/tags',
  'liquid/filters/urls',

  'liquid/tags/back_url',
  'liquid/tags/cacher',
  'liquid/tags/cms_controls',
  'liquid/tags/csrf',
  'liquid/tags/home_path',
  'liquid/tags/paginate',
  'liquid/tags/part',
  'liquid/tags/render',
  'liquid/tags/textile',
  'liquid/tags/vote',
]

base_url = File.dirname(__FILE__)
REQUIRED_DROP_FILES_REDMINE_CMS.each { |file| require(base_url + '/' + file) }
