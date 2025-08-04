 module Hook
    class MentionHooks < Redmine::Hook::ViewListener
        # render_on :view_issues_edit_notes_bottom,:partial => 'issue/index'
        render_on :view_issues_form_details_top,:partial => 'issue/form'
        render_on :view_layouts_base_content, :partial => 'wiki/form'
      end
    end
