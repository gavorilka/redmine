Redmine::Plugin.register :flux_tags do
  name 'Redmineflux Tags plugin'
  author 'Redmineflux - Powered by Zehntech Technologies Inc'
  description 'Streamline project management tasks using Redmineflux Tag Plugin for categorize and retrieve information efficiently with tags.'
  version '1.0.4'
  url 'https://www.redmineflux.com/knowledge-base/plugins/tag-plugin'
  author_url 'https://www.redmineflux.com'

  settings default: {
    issue_inline: "0"
  }, :partial => 'tags/settings'
  permission :manage_project_tags, { default: true }
  project_module :issue_tracking do 
    permission :manage_issues_tags, { default: true }
  end
  project_module :time_tracking do
    permission :manage_time_entries_tags, { default: true }
  end
  
end


if Redmine::VERSION::MAJOR == 4
  require_relative './lib/issues_tag/view_issues_hooks.rb'
  require_relative './lib/issues_tag/model_issue_hooks.rb'
  require_relative './lib/patches/issue_patch.rb'
  require_relative './lib/patches/issues_controller_patch'
  require_relative './lib/patches/issue_query_patch'
  require_relative './lib/patches/queries_helper_patch'
  require_relative './lib/patches/auto_completes_controller_patch.rb'
  require_relative './lib/patches/project_patch.rb'
  require_relative './lib/patches/project_query_patch'
  require_relative './lib/patches/time_entries_controller_patch'
  require_relative './lib/flux_tags/patches/time_entry_patch'
  require_relative './lib/patches/time_entry_query_patch'
  require_relative './lib/patches/issues_pdf_helper_patch'
  require_relative './lib/custom_will_paginate_renderer.rb'

elsif Redmine::VERSION::MAJOR == 5
  require File.expand_path('./lib/issues_tag/view_issues_hooks.rb', __dir__)
  require File.expand_path('./lib/issues_tag/model_issue_hooks.rb', __dir__)
  require File.expand_path('./lib/patches/issue_patch.rb', __dir__)
  require File.expand_path('./lib/patches/issues_controller_patch', __dir__)
  require File.expand_path('./lib/patches/issue_query_patch', __dir__)
  require File.expand_path('./lib/patches/queries_helper_patch', __dir__)
  require File.expand_path('./lib/patches/auto_completes_controller_patch.rb', __dir__)
  require File.expand_path('./lib/patches/project_patch.rb', __dir__)
  require File.expand_path('./lib/patches/project_query_patch', __dir__)
  require File.expand_path('./lib/patches/time_entries_controller_patch.rb', __dir__)
  require File.expand_path('./lib/flux_tags/patches/time_entry_patch.rb', __dir__)
  require File.expand_path('./lib/patches/time_entry_query_patch.rb', __dir__)
  require File.expand_path('./lib/patches/issues_controller_patch.rb', __dir__)
  require File.expand_path('./lib/patches/issues_pdf_helper_patch', __dir__)
  require File.expand_path('./lib/custom_will_paginate_renderer.rb', __dir__)

end