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

class CmsPartsController < ApplicationController
  before_action :require_edit_permission, :except => [:show]
  before_action :find_part, :except => [:index, :new, :create, :show]
  before_action :find_page_part, :only => [:show]
  before_action :authorize_part, :only => [:show]
  before_action :require_admin, :only => :destroy

  helper :attachments
  helper :cms
  helper :cms_pages

  protect_from_forgery :except => :show

  def index
    redirect_to :controller => 'cms_pages', :action => 'index', :tab => 'parts'
  end

  def preview
    @current_version = @cms_part.set_content_from_version(params[:version]) if params[:version]
    @cms_page.listener = self
    @preview_content = @cms_page.render_part(@cms_part)
  end

  def show
    @cms_page.listener = self
    render(:plain => @cms_page.render_part(@cms_part), :layout => false)
  end

  def edit
    @current_version = @cms_part.set_content_from_version(params[:version]) if params[:version]
  end

  def expire_cache
    Rails.cache.delete(@cms_part)
    redirect_to :back
  end

  def new
    @cms_part = CmsPart.new(:filter_id => 'textile', :page_id => params[:page_id])
    @cms_part.copy_from(params[:copy_from]) if params[:copy_from]
  end

  def refresh
    expire_fragment(@cms_part)
  end

  def update
    @cms_part.safe_attributes = params[:cms_part]
    @cms_part.save_attachments(params[:attachments])
    if @cms_part.save
      render_attachment_warning_if_needed(@cms_part)
      flash[:notice] = l(:notice_successful_update)
      respond_to do |format|
        format.html do
          redirect_back_or_default edit_cms_part_path(@cms_part)
        end
        format.js do
          find_parts
          render :action => 'change'
        end
      end
    else
      render :action => 'edit'
    end
  end

  def create
    @cms_part = CmsPart.new
    @cms_part.safe_attributes = params[:cms_part]
    @cms_part.save_attachments(params[:attachments])
    if @cms_part.save
      render_attachment_warning_if_needed(@cms_part)
      flash[:notice] = l(:notice_successful_create)
      redirect_to :action => 'edit', :id => @cms_part
    else
      render :action => 'new'
    end
  end

  def destroy
    if params[:version]
      version = @cms_part.versions.where(:version => params[:version]).first
      if version.current_version?
        flash[:warning] = l(:label_cms_version_cannot_destroy_current)
      else
        version.destroy
      end
      redirect_to history_cms_part_path(@cms_page)
    else
      @cms_part.destroy
      redirect_to :controller => 'cms_pages', :action => 'edit', :tab => 'page_parts', :id => @cms_page
    end
  end

  private

  def authorize_part
    deny_access unless @cms_part.page.visible?
  rescue ActiveRecord::RecordNotFound
    render_404
  end

  def find_parts
    @cms_page = @cms_part.page
    @cms_parts = @cms_page.parts.order(:position)
  end

  def find_page_part
    @cms_part = CmsPart.active.joins(:page).includes(:page => :attachments).where(:page_id => params[:page_id]).find_part(params[:id] || params[:name])
    raise ActiveRecord::RecordNotFound if @cms_part.blank?
    @cms_page = @cms_part.page
  rescue ActiveRecord::RecordNotFound
    render_404
  end

  def find_part
    @cms_part = CmsPart.includes(:page).find(params[:id])
    @cms_page = @cms_part.page
  rescue ActiveRecord::RecordNotFound
    render_404
  end

  def require_edit_permission
    deny_access unless RedmineupCms.allow_edit?
  end
end
