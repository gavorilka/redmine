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

# Load the Redmine helper
require File.expand_path(File.dirname(__FILE__) + '/../../../test/test_helper')

def test_attachment
  Attachment.create(:file => 'test', :filename => 'test.txt', :content_type => 'text/plain', :author => User.find(1))
end

def redmine_cms_fixture_files_path
  "#{Rails.root}/plugins/redmineup_cms/test/fixtures/files/"
end

class RedmineupCms::TestCase
  include ActionDispatch::TestProcess

  def self.plugin_fixtures(plugin, *fixture_names)
    plugin_fixture_path = "#{Redmine::Plugin.find(plugin).directory}/test/fixtures"
    if fixture_names.first == :all
      fixture_names = Dir["#{plugin_fixture_path}/**/*.{yml}"]
      fixture_names.map! { |f| f[(plugin_fixture_path.size + 1)..-5] }
    else
      fixture_names = fixture_names.flatten.map { |n| n.to_s }
    end

    ActiveRecord::Fixtures.create_fixtures(plugin_fixture_path, fixture_names)
  end

  def self.create_fixtures(table_names, class_names = {})
    fixtures_directory = Redmine::Plugin.find(:redmineup_cms).directory + '/test/fixtures/'
    ActiveRecord::FixtureSet.create_fixtures(fixtures_directory, table_names, class_names = {})
  end

  module TestHelper
    def compatible_request(type, action, parameters = {})
      send(type, action, :params => parameters)
    end

    def compatible_xhr_request(type, action, parameters = {})
      send(type, action, :params => parameters, :xhr => true)
    end

    def cms_uploaded_file(filename, mime)
      prefix = '../../'
      path = "plugins/redmineup_cms/test/fixtures/files/#{filename}"
      prefix += '../' if Rails.version >= '7.0'
      fixture_file_upload(prefix + path, mime, true)
    end
  end
end
