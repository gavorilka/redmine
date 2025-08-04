module IssuesTagsHelper
    # def sidebar_tags
    #   unless @sidebar_tags
    #     @sidebar_tags = []
    #     if :none != FluxTags.settings[:issues_sidebar].to_sym
    #       @sidebar_tags = Issue.available_tags project: @project,
    #         open_only: (FluxTags.settings[:issues_open_only].to_i == 1)
    #     end
    #   end
    #   @sidebar_tags
    # end
  
    # def render_sidebar_tags
    #   render_tags_list sidebar_tags, {
    #     show_count: (FluxTags.settings[:issues_show_count].to_i == 1),
    #     open_only: (FluxTags.settings[:issues_open_only].to_i == 1),
    #     style: FluxTags.settings[:issues_sidebar].to_sym }
    # end
end