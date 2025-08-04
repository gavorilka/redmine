class EditorHooks < Redmine::Hook::ViewListener
    def view_layouts_base_body_bottom(context)
        if User.current.allowed_to?(:edit_issues, context[:project])
            javascript_include_tag('issue_editor.js', :plugin => :inplace_issue_editor)+
            stylesheet_link_tag('issue_editor.css', :plugin => :inplace_issue_editor)
        end 
    end 
end