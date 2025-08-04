class IssueTablesController < ApplicationController
  accept_api_auth :fetch_active_members, :fetch_issue_allowed_status, :all_custom_fields, :all_projects, :all_versions, :check_agile_board_enabled, :issue_images

  # Require login for these actions
  before_action :require_login

  # Disable CSRF protection for JSON API requests
  skip_before_action :verify_authenticity_token, if: -> { request.format.json? } 

  def fetch_active_members
    current_project = Project.find_by(id: params[:id])
    if current_project.nil?
      render json: { error: 'Project not found' }, status: :not_found
      return
    end
    active_members = current_project.users.where(status: 1)
    mapped_active_members = active_members.map { |member| { id: member.id, name: member.name } }
    sorted_active_members = mapped_active_members.sort_by { |member| member[:name] }

    render json: { active_members: sorted_active_members }, status: :ok
  end

  # def fetch_issue_allowed_status
  #   issue=Issue.find_by(id: params[:id])
  #   if issue.nil?
  #     render json: { error: 'Issue not found' }, status: :not_found
  #     return
  #   end
  #   allowed_status = issue.new_statuses_allowed_to
  #   render json: { allowed_status: allowed_status }, status: :ok
  # end

  def fetch_issue_allowed_status
    issue = Issue.find_by(id: params[:id])
    
    if issue.nil?
      render json: { error: 'Issue not found' }, status: :not_found
      return
    end
    allowed_status = issue.new_statuses_allowed_to(User.current)
    if allowed_status.present?
      render json: { allowed_status: allowed_status.map { |status| { id: status.id, name: status.name } } }, status: :ok
    else
      render json: { message: 'No statuses available for this issue' }, status: :ok
    end
  end

  # def create
  #   current_project = Project.find_by(id: params[:id])

  #   # Check if the project exists
  #   if current_project.nil?
  #     render json: { message: 'Project not found' }, status: :not_found
  #     return
  #   end

  #   # Update the project name if the 'name' parameter is provided
  #   if params[:name].present?
  #     if current_project.update(name: params[:name])
  #       render json: { message: 'Project name updated successfully' }, status: :ok
  #     else
  #       render json: { error: 'Failed to update project name' }, status: :unprocessable_entity
  #     end
  #   else
  #     render json: { error: 'Name parameter missing' }, status: :unprocessable_entity
  #   end
  # end
  def all_projects
    all_projects = Project.all.as_json(only: [:id, :name]) # Add other relevant attributes if needed
    render json: { projects: all_projects }, status: :ok
  end

  def all_custom_fields
    custom_fields = CustomField.all
    render json: custom_fields.as_json(only: [:id, :name, :customized_type, :format_store, :field_format, :regexp, :min_length, :max_length, :is_required, :is_filter, :searchable, :multiple, :default_value, :visible, :possible_values]), status: :ok
  end

  def all_versions
    @projects=Project.where(id: params[:id]).to_a
    @versions = @projects.map { |p| p.shared_versions.open }.reduce(:&)
    @versions_sorted = @versions.sort
    agile_board_enabled = @projects.first.enabled_modules.any? { |m| m.name == "agile_board" }
    if params[:indata]=='yes'
      version_names = @versions_sorted.map do |v|
        if v.project == @projects.first
          { id: v.id, name: "#{v}" }
        else
          { id: v.id, name: "#{v.project} - #{v}" }
        end
      end
    else
      version_names = @versions_sorted.map do |v|
          { id: v.id, name: "#{v.project} - #{v}" }
      end
    end
    render json: { version: version_names }
  end
  
  def check_agile_board_enabled
    @issue=Issue.where(id:params[:id]).first
    @project=Project.where(id: @issue.project_id).first
    agile_board_enabled = @project.enabled_modules.any? { |m| m.name == "agile_board" }
    render json: { agile_board_enabled: agile_board_enabled }
  end

  def issue_images
    issue_id = params[:issueId]
    image_name = ActionView::Base.full_sanitizer.sanitize(params[:imageName])
    attachment = Attachment.where(container_id: issue_id, container_type: "Issue", filename: image_name).first
    if attachment.present?
      render json: {
        attachment: attachment
      }
    else
      render json: { error: 'Image not found' }, status: :not_found
    end
  end
  
end
