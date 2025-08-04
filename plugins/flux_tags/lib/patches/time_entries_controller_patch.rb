module Patches
  module TimeEntriesControllerPatch
    extend ActiveSupport::Concern

    included do
      helper :tags
      include TagsHelper
    end
  end
end

base = TimelogController
patch = Patches::TimeEntriesControllerPatch
base.send(:include, patch) unless base.included_modules.include?(patch)