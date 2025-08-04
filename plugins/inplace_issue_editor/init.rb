
if Redmine::VERSION::MAJOR == 4
  require_relative './lib/editor_hooks.rb'
  require_relative './lib/timer/timer_hooks.rb'
elsif  Redmine::VERSION::MAJOR >= 5
  require File.expand_path('./lib/editor_hooks.rb', __dir__)
  require File.expand_path('./lib/timer/timer_hooks.rb', __dir__)
end

Redmine::Plugin.register :inplace_issue_editor do
  name 'Redmineflux Inline Issue Editor plugin'
  author 'Redmineflux - Powered by Zehntech Technologies Inc'
  description 'Enables seamless inline editing of various fields in Redmine, enhancing user experience and productivity with real-time updates and support for custom fields/plugins.'
  version '1.4.1'
  url 'https://www.redmineflux.com/knowledge-base/plugins/inline-editor-plugin/'
  author_url 'https://www.redmineflux.com'
  settings partial: 'settings/blank_pages'

  # permission :edit_project, { :projects => :edit }
  # permission :edit_issue, { :issues => :edit }
  #define roles
  # project_module :inplace_issue_editor do
  #   permission :edit_project, {}
  # end

  # project_module :inplace_issue_editor do
  #   permission :edit_issue, {}
  # end
end
