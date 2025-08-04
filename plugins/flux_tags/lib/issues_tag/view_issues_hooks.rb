
module IssuesTag
    class ViewIssuesHooks < Redmine::Hook::ViewListener
        render_on :view_issues_show_details_bottom, partial: 'issues/tags'
        render_on :view_issues_form_details_bottom, partial: 'issues/tags_form'
        render_on :view_issues_sidebar_planning_bottom, partial: 'issues/tags_sidebar'
        render_on :view_issues_bulk_edit_details_bottom, partial: 'issues/bulk_edit_tags'
        render_on :view_layouts_base_html_head, partial: 'tags/header_assets' 
        render_on :view_timelog_edit_form_bottom, partial: 'time_entries/time_entry_tags_form'
        render_on :view_projects_form, partial: 'project_tags/add_tag_field_to_project_form'       
    end 
end 