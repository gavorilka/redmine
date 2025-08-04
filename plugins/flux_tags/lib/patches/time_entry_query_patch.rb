module Patches
  module TimeEntryQueryPatch
    def self.included(base)
      base.send :include, InstanceMethods
      base.class_eval do 
        alias_method :available_filters_without_tags, :available_filters
        alias_method :available_filters, :available_filters_with_tags

        alias_method :add_filter_error_without_override, :add_filter_error
        alias_method :add_filter_error, :add_filter_error_with_override

        alias_method :available_columns_without_tags, :available_columns
        alias_method :available_columns, :available_columns_with_tags
      end 
    end

    module InstanceMethods
      def sql_for_tags_field(field, operator, value)
        case operator
        when '=', '!'
          time_entries = TimeEntry.tagged_with(values_for('tags'), any: true)
        when '!*'
          time_entries = TimeEntry.tagged_with(ActsAsTaggableOn::Tag.all.map(&:to_s), exclude: true)
        else  
          time_entries = TimeEntry.tagged_with(ActsAsTaggableOn::Tag.all.map(&:to_s), any: true)
        end 
        compare = operator.eql?('!') ? 'NOT IN' : 'IN'
        ids_list = time_entries.collect {|time_entry| time_entry.id }.push(0).join(',')

        puts "ids_list:TimeEntry:: #{ids_list}"

        "(#{TimeEntry.table_name}.id #{compare} (#{ids_list}))"
      end 

      def available_filters_with_tags
        if @available_filters.blank?
          add_available_filter('tags', type: :list_optional, name: l(:field_tags),
            values: TimeEntry.available_tags(project: project).collect {|t| [t.name, t.name]}
          ) unless available_filters_without_tags.key?('tags')
        else
          available_filters_without_tags
        end
        @available_filters
      end 

      def add_filter_error_with_override(field, message)
        field_label = field.is_a?(Symbol) ? field.to_s.capitalize : label_for(field)
        m = "#{field_label} #{l(message, scope: 'activerecord.errors.messages')}"
        errors.add(:base, m)
      end

      def available_columns_with_tags
        if @available_columns.blank?
          @available_columns = available_columns_without_tags
          @available_columns << QueryColumn.new(:tags, caption: l(:field_tags))
        else
          @available_columns_without_tags
        end
        @available_columns
      end
    end 
  end
end 

# Ensure that the patch is included only once
TimeEntryQuery.send(:include, Patches::TimeEntryQueryPatch) unless TimeEntryQuery.included_modules.include?(Patches::TimeEntryQueryPatch)
