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

class CmsSnippetsController < ApplicationController
  before_action :require_edit_permission
  before_action :find_snippet, :except => [:index, :new, :create]

  helper :sort
  include SortHelper  
  helper :attachments
  helper :cms
  helper :cms_pages

  def index
    sort_init 'name', 'asc'
    sort_update %w(name filter created_at updated_at)

    case params[:format]
    when 'xml', 'json'
      @offset, @limit = api_offset_and_limit
    else
      @limit = per_page_option
    end

    scope = CmsSnippet.all
    scope = scope.like(params[:name]) if params[:name].present?
    snippet_ids = scope.tagged_with(params[:tag]).map(&:id) if params[:tag].present?
    scope = scope.where(id: snippet_ids) if snippet_ids
    scope = scope.where(filter_id: params[:filter_id]) if params[:filter_id].present?

    @snippets_count = scope.count
    @snippets_pages = Paginator.new @snippets_count, @limit, params['page']
    @offset ||= @snippets_pages.offset
    @snippets = scope.order(sort_clause).limit(@limit).offset(@offset).to_a
  end

  def preview
    @current_version = @cms_snippet.set_content_from_version(params[:version]) if params[:version]
    page = CmsPage.new(:listener => self)
    @preview_content = page.render_part(@cms_snippet)
  end

  def edit
    @current_version = @cms_snippet.set_content_from_version(params[:version]) if params[:version]
  end

  def new
    @cms_snippet = CmsSnippet.new(:filter_id => 'textile')
    @cms_snippet.copy_from(params[:copy_from]) if params[:copy_from]
  end

  def update
    @cms_snippet.safe_attributes = params[:cms_snippet]
    @cms_snippet.save_attachments(params[:attachments])
    if @cms_snippet.save
      render_attachment_warning_if_needed(@cms_snippet)
      flash[:notice] = l(:notice_successful_update)
      respond_to do |format|
        format.html { redirect_back_or_default edit_cms_snippet_path(@cms_snippet) }
      end
    else
      render :action => 'edit'
    end
  end

  def create
    @cms_snippet = CmsSnippet.new
    @cms_snippet.safe_attributes = params[:cms_snippet]
    @cms_snippet.save_attachments(params[:attachments])
    if @cms_snippet.save
      render_attachment_warning_if_needed(@cms_snippet)
      flash[:notice] = l(:notice_successful_create)
      redirect_to :action => 'edit', :id => @cms_snippet
    else
      render :action => 'new'
    end
  end

  def destroy
    if params[:version]
      version = @cms_snippet.versions.where(:version => params[:version]).first
      if version.current_version?
        flash[:warning] = l(:label_cms_version_cannot_destroy_current)
      else
        version.destroy
      end
      redirect_to history_cms_snippet_path(@cms_page)
    else
      @cms_snippet.destroy
      redirect_to :controller => 'cms_snippets', :action => 'index'
    end
  end

  private

  def find_snippets
    @snippets = CmsSnippet.order(:name)
  end

  def find_snippet
    @cms_snippet = CmsSnippet.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render_404
  end

  def require_edit_permission
    deny_access unless RedmineupCms.allow_edit?
  end
end
