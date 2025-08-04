module Patches
  module AutoCompletesControllerPatch
    def self.included(base)
      base.send :include, InstanceMethods
    end

    module InstanceMethods
      def issue_tags
        @name = params[:q].to_s
        @tags = Issue.available_tags(project: @project, name_like: @name)
        render json: Array(@tags.pluck(:name).sort), content_type: "application/json"
      end

      def project_tags
        @name = params[:q].to_s
        @tags = Project.available_tags(name_like: @name)
        render json: Array(@tags.pluck(:name).sort), content_type: "application/json"
      end

      def time_entry_tags
        @name = params[:q].to_s
        @tags = TimeEntry.available_tags project: @project, name_like: @name
        render json: Array(@tags.pluck(:name).sort), content_type: "application/json"
      end
      
    end
  end
end

base = AutoCompletesController
patch = Patches::AutoCompletesControllerPatch
base.send(:include, patch) unless base.included_modules.include?(patch)
