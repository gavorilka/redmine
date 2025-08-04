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
    module WelcomeControllerPatch
      def self.included(base)
        base.send(:include, InstanceMethods)
        base.send(:include, CmsPagesHelper)

        base.class_eval do
          alias_method :index_without_cms, :index
          alias_method :index, :index_with_cms
          before_action :set_locale
          helper :cms_pages
        end
      end

      module InstanceMethods
        def index_with_cms
          @news = News.latest User.current
          @projects = Project.latest User.current
          if @cms_page = CmsPage.includes([:attachments, :parts]).includes(:parts => :attachments).where(:id => RedmineupCms.landing_page).first
            if @cms_page.layout.blank?
              render :template => 'cms_pages/show.html.erb', layout: true
            else
              render(:plain => @cms_page.process(self), :layout => false)
            end
          end
        end
      end
    end
  end
end

unless WelcomeController.included_modules.include?(RedmineupCms::Patches::WelcomeControllerPatch)
  WelcomeController.send(:include, RedmineupCms::Patches::WelcomeControllerPatch)
end
