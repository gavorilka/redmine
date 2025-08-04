# Rails.configuration.to_prepare do
if Redmine::VERSION::MAJOR == 4

  require_relative './lib/hook/mention_hooks.rb'
  require_dependency 'journal'
  require_relative './lib/patch/issue_controller_patch.rb'
  require_relative './lib/patch/wiki_controller_patch.rb'
  require_relative './lib/patch/issue_creation_patch.rb'
  require 'redmine'
  
  elsif  Redmine::VERSION::MAJOR >= 5
  
    require File.expand_path('./lib/hook/mention_hooks.rb', __dir__)
    require File.expand_path('./lib/patch/issue_controller_patch.rb', __dir__)
    require File.expand_path('./lib/patch/wiki_controller_patch.rb', __dir__)  
    require File.expand_path('./lib/patch/issue_creation_patch.rb', __dir__) 
    require File.expand_path('./lib/patch/application_helper_patch.rb', __dir__) 
  end
# end



Redmine::Plugin.register :flux_mentions do
  name 'Redmineflux Mentions plugin'
  author 'Redmineflux - Powered by Zehntech Technologies Inc'
  description 'Facilitates email notifications for users when mentioned in Notes, Descriptions, and Wiki content.'
  version '6.0.0'
  url 'https://www.redmineflux.com/knowledge-base/plugins/mentions-plugin/'
  author_url 'https://www.redmineflux.com'
  settings :default => {'symbol' => '@'}, :partial => 'setting/symbol'
end


