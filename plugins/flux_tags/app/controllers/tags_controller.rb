class TagsController < ApplicationController
  before_action :require_login
  before_action :require_admin
  accept_api_auth :show, :edit, :update, :destroy
  before_action :find_tag, only: [:edit, :update]
  before_action :bulk_find_tags, only: [:context_menu, :merge, :destroy]
  skip_before_action :verify_authenticity_token, if: -> { request.format.json? }
  helper :tags
  include TagsHelper

  def show
    render json: @tag, status: :ok
  end

  def edit; end

  def show
    @tag = ActsAsTaggableOn::Tag.find_by(id: params[:id])
    
    if @tag
      render json: @tag, status: :ok
    else
      render json: { error: "Tag not found" }, status: :not_found
    end
  end
   
  def destroy
    begin
      tags = bulk_find_tags
      tags.each(&:destroy)
  
      respond_to do |format|
        if request.xhr? # AJAX request handling
          flash[:notice] = I18n.t('tags.delete_success')
          format.js { render js: "window.location = '/settings/plugin/flux_tags?tab=#{params[:tab] || 'manage_tags'}'" }
        else
          format.html do
            flash[:notice] = I18n.t('tags.delete_success')
            redirect_to controller: 'settings', action: 'plugin', id: 'flux_tags', tab: params[:tab] || 'manage_tags'
          end
          format.json { render json: { message: "Tags deleted successfully" }, status: :ok }
        end
      end
    rescue ActiveRecord::RecordNotFound => e
      respond_to do |format|
        format.html do
          flash[:error] = I18n.t('tags.delete_failure')
          redirect_to controller: 'settings', action: 'plugin', id: 'flux_tags', tab: 'manage_tags'
        end
        format.json { render json: { success: false, error: e.message }, status: :not_found }
      end
    end
  end
  
  
  

  def update
    @tag.update(name: params[:tag][:name])

    if @tag.save
      flash[:notice] = l :notice_successful_update

      respond_to do |format|
        format.html do
          redirect_to controller: 'settings', action: 'plugin', id: 'flux_tags', tab: params[:tab]
        end
        format.json { render json: { message: "Tag updated successfully", tag: @tag }, status: :ok }
      end
    else
      respond_to do |format|
        format.html { render action: 'edit' }
        format.json { render json: { error: "Failed to update tag", details: @tag.errors.full_messages }, status: :unprocessable_entity }
      end
    end
  end

  def context_menu
    @tag = @tags.first if @tags.size == 1
    @back = back_url
    render layout: false
  end

  def merge
    if request.post? && params[:tag] && params[:tag][:name]
      ActsAsTaggableOn::Tagging.transaction do
        tag = ActsAsTaggableOn::Tag.where(name: params[:tag][:name]).first ||
              ActsAsTaggableOn::Tag.create(params[:tag])

        ActsAsTaggableOn::Tagging.where(tag_id: @tags.map(&:id))
                                 .update_all(tag_id: tag.id)
        @tags.reject { |t| t.id == tag.id }.each(&:destroy)

        respond_to do |format|
          format.html do
            redirect_to controller: 'settings', action: 'plugin', id: 'flux_tags', tab: 'manage_tags'
          end
          format.json { render json: { message: "Tags merged successfully", tag: tag }, status: :ok }
        end
      end
    else
      render json: { error: "Invalid merge request" }, status: :unprocessable_entity
    end
  end

  private

  def bulk_find_tags
    @tags = ActsAsTaggableOn::Tag.where(id: params[:id] || params[:tag_ids])
    raise ActiveRecord::RecordNotFound if @tags.empty?
    @tags
  end

  def find_tag
    @tag = ActsAsTaggableOn::Tag.where(id: params[:id]).first or render_404
  end
end
