class IssueTagsZtController < ApplicationController
    before_action :find_issues, only: %i[edit]
    accept_api_auth :update

    def edit
        return unless FluxTags.setting?(:active_issue_tags) && User.current.allowed_to?(:edit_issue_tags, @project.first)
        @issue_ids = params[:ids]
        @bulk_edit = @issue_ids.size > 1
        @issue_tags = if @bulk_edit
            issues = @issues.map(&:tag_list)
            issues.flatten!
            issues.uniq 
        else
            @issues.first.tag_list
        end

        @issue_tags.sort!

       end 
    
  
    
# ---------------------------------------


def update
  @issue = Issue.find(params[:id])
  tags = params[:tag_list].split(",").map(&:strip) if params[:tag_list].present?

  if update_tags(@issue, tags)
    render json: @issue

  else  
    render json: { error: "Failed to add tags" }, status: :unprocessable_entity
  end 

rescue StandardError => e 
  Rails.logger.warn "Failed to add Tags :#{e.inspect}"
  render json: { error: "Failed to add tags" }, status: :unprocessable_entity
end 

def update_tags(issue, tags)
  issue.tag_list = tags
  issue.save
end




end 


