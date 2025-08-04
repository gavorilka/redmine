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

require_dependency 'auto_completes_controller'

module RedmineupCms
  module Patches
    module AutoCompletesControllerPatch
      def self.included(base)
        base.send(:include, InstanceMethods)

        base.class_eval do
        end
      end

      module InstanceMethods
        def cms_page_tags
          @names_only = params[:names]
          @cms_page_tags = []
          q = (params[:q] || params[:term]).to_s.strip
          scope = CmsPage.tags_cloud(:name_like => q, :limit => params[:limit] || 10)
          @cms_page_tags = scope.to_a.sort! { |x, y| x.name <=> y.name }
          render :layout => false, :partial => 'cms_page_tags'
        end

        def cms_pages
          @names_only = params[:names]
          @cms_pages = []
          q = (params[:q] || params[:term]).to_s.strip
          scope = CmsPages.like(q).limit(params[:limit] || 10)
          options = []
          CmsPages.page_tree(scope) do |page, level|
            label = (level > 0 ? '&nbsp;' * 2 * level + '&#187; ' : '').html_safe
            label << page.name
            options << [label, page.id]
          end

          @cms_pages = options
          render :layout => false, :partial => 'cms_pages'
        end

        def cms_snippet_tags
          @names_only = params[:names]
          @cms_page_tags = []
          q = (params[:q] || params[:term]).to_s.strip
          scope = CmsSnippet.available_tags(:name_like => q, :limit => params[:limit] || 10)
          @cms_page_tags = scope.to_a.sort! { |x, y| x.name <=> y.name }
          render :layout => false, :partial => 'cms_page_tags'
        end
      end
    end
  end
end

unless AutoCompletesController.included_modules.include?(RedmineupCms::Patches::AutoCompletesControllerPatch)
  AutoCompletesController.send(:include, RedmineupCms::Patches::AutoCompletesControllerPatch)
end
