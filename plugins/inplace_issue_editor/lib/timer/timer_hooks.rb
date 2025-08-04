module Timer
    class TimerHooks < Redmine::Hook::ViewListener
        # render_on :view_issues_new_top, :partial => "issues/timer"
        render_on :view_layouts_base_html_head, :partial => "issues/header_assets"
        render_on :view_issues_show_details_bottom, :partial => "issues/assets"
    end 
end 