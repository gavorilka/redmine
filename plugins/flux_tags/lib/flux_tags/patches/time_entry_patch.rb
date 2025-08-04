module FluxTags
module Patches
  module TimeEntryPatch
    def self.included(base)
      base.extend(ClassMethods)
      base.send(:include, InstanceMethods)

      base.class_eval do
        acts_as_ordered_taggable

        before_save :prepare_tag_change
        after_save :remove_unused_tags
        safe_attributes 'tag_list'

        alias_method :copy_from_without_flux_tags, :copy_from if method_defined?(:copy_from)
        alias_method :copy_from, :copy_from_with_flux_tags if method_defined?(:copy_from)

        unless defined?(searchable_options) && searchable_options
          class_attribute :searchable_options, instance_accessor: false, instance_predicate: false
          self.searchable_options = { columns: [], preload: [] }
        end

        searchable_options[:columns] ||= []
        searchable_options[:preload] ||= []

        searchable_options[:columns] << "tags.name"
        searchable_options[:preload] << :tags

        old_scope = searchable_options[:scope]

        searchable_options[:scope] = lambda do |options|
          new_scope = old_scope.is_a?(Proc) ? old_scope.call(options) : old_scope
          new_scope
            .joins("LEFT JOIN taggings ON taggings.taggable_id = #{base.table_name}.id AND taggings.context = 'tags' AND taggings.taggable_type = '#{base.to_s}'")
            .joins('LEFT JOIN tags ON tags.id = taggings.tag_id')
        end
      end
    end

    module ClassMethods
      def available_tags(options = {})
        time_entries_scope = TimeEntry.visible
        time_entries_scope = time_entries_scope.joins(:project).where(projects: { id: options[:project] }) if options[:project]
        
        result_scope = ActsAsTaggableOn::Tag.joins(:taggings)
          .select('tags.id, tags.name, tags.taggings_count, COUNT(taggings.id) as count')
          .group('tags.id, tags.name, tags.taggings_count')
          .where(taggings: { taggable_type: 'TimeEntry', taggable_id: time_entries_scope })
          .order('tags.name')
        
        if options[:name_like]
          pattern = "%#{options[:name_like].to_s.strip}%"
          result_scope = result_scope.where('LOWER(tags.name) LIKE LOWER(:pattern)', pattern: pattern)
        end
        
        result_scope
      end

      def allowed_tags?(tags)
        allowed_tags = all_tags.map(&:name)
        tags.all? { |tag| allowed_tags.include?(tag) }
      end
    end

    module InstanceMethods
      def copy_from_with_flux_tags(arg)
        copy_from_without_flux_tags(arg) if respond_to?(:copy_from_without_flux_tags)
        self.tag_list = arg.tag_list if arg.respond_to?(:tag_list)
      end
      def remove_unused_tags
        unused_tags = ActsAsTaggableOn::Tag.where(taggings_count: 0)
        unused_tags.destroy_all
      end
      def prepare_tag_change
        if tag_list_changed?
        end
      end
    end
  end
end
end

base = TimeEntry
patch = FluxTags::Patches::TimeEntryPatch
base.send(:include, patch) unless base.included_modules.include?(patch)