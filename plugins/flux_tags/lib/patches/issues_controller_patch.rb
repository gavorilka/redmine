
module Patches
    module IssuesControllerPatch
    extend ActiveSupport::Concern

        included do
            helper :issues_tags
            helper :tags
            include TagsHelper
        end
    end 
end

base = IssuesController
patch = Patches::IssuesControllerPatch
base.send(:include, patch) unless base.included_modules.include?(patch)



