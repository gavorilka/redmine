# encoding: utf-8
#
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

require File.expand_path('../../test_helper', __FILE__)

module CmsMenuTestHelper
  # Assertions
  def assert_number_of_items_in_menu(menu_name, count)
    assert Redmine::MenuManager.items(menu_name).size >= count, "Menu has less than #{count} items"
  end

  def assert_menu_contains_item_named(menu_name, item_name)
    assert Redmine::MenuManager.items(menu_name).collect(&:name).include?(item_name.to_sym), "Menu did not have an item named #{item_name}"
  end

  def assert_menu_not_contains_item_named(menu_name, item_name)
    assert Redmine::MenuManager.items(menu_name).collect(&:name).exclude?(item_name.to_sym), "Menu have an item named #{item_name}"
  end
end

class CmsMenuTest < ActiveSupport::TestCase
  include CmsMenuTestHelper

  fixtures :projects, :users

  RedmineupCms::TestCase.create_fixtures([:cms_layouts, :cms_snippets, :cms_pages, :cms_parts,
                                        :cms_page_fields, :cms_menus, :cms_content_versions])

  def test_default_top_menu
    assert_number_of_items_in_menu :top_menu, 4
    assert_menu_contains_item_named :top_menu, :home
    assert_menu_contains_item_named :top_menu, :projects
    assert_menu_contains_item_named :top_menu, :administration
    assert_menu_contains_item_named :top_menu, :help
  end

  def test_top_menu_with_deleted_my_page_item
    # my_page element deleted into init.rb
    assert_menu_not_contains_item_named :top_menu, :my_page
  end
end
