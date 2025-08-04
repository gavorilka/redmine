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

class RedmineupCms::CommonViewsTest < Redmine::ApiTest::Base
  include RedmineupCms::TestCase::TestHelper
  fixtures :projects, :users

  RedmineupCms::TestCase.create_fixtures([:cms_layouts, :cms_snippets, :cms_pages, :cms_parts,
                                        :cms_page_fields, :cms_menus, :cms_content_versions])

  def setup
    CmsPage.rebuild_tree!
    @cms_page = CmsPage.find(1)
  end

  def test_index_pages
    log_user('admin', 'admin')
    compatible_request :get, '/cms/snippets'
    assert_response :success
    compatible_request :get, '/cms/settings'
    assert_response :success
    compatible_request :get, '/cms/pages'
    assert_response :success
    compatible_request :get, '/cms/menus'
    assert_response :success
    compatible_request :get, '/cms/layouts'
    assert_response :success
    compatible_request :get, '/cms/redmine_layouts'
    assert_response :success
    compatible_request :get, '/cms/settings/redmine_hooks'
    assert_response :success
    compatible_request :get, '/cms/redirects'
    assert_response :success
    compatible_request :get, '/cms/assets'
    assert_response :success
    compatible_request :get, '/cms/variables'
    assert_response :success
  end

  def test_page_filters
    filters_page = CmsPage.find(5)
    filters_page.attachments.create!(file: cms_uploaded_file("image.png", "image/png"), author: User.find(1))

    compatible_request :get, "/pages/#{filters_page.slug}"
    assert_response :success

    page_body = response.body
    assert_match /download\/\d+\/image.png/, page_body
    assert_match /thumbnail\/\d+\/100\/image.png/, page_body
    assert_match /timelink\/\d+\/\d+/, page_body
    assert_match /pages\/5\/parts\/filter_part/, page_body
    assert_match /pages\/page_001\/page_002/, page_body
    assert_match /<script.+\.js/, page_body
  end
end
