module Patches
    module IssuesPdfHelperPatch
      def self.included(base)
        base.send(:include, InstanceMethods)
        base.class_eval do
          alias_method :fetch_row_values_without_tags, :fetch_row_values
          alias_method :fetch_row_values, :fetch_row_values_with_tags
        end
      end
  
      module InstanceMethods
        def fetch_row_values_with_tags(issue, query, level)
          query.inline_columns.collect do |column|
            s = if column.is_a?(QueryCustomFieldColumn)
                  cv = issue.visible_custom_field_values.detect { |v| v.custom_field_id == column.custom_field.id }
                  show_value(cv, false)
                else
                  value = if column.name.to_s == 'parent.subject'
                  issue.parent ? issue.parent.subject.to_s : ''
                  else
                  value = issue.send(column.name)
                  end
                  if column.name == :subject
                    value = "  " * level.to_i + value.to_s
                  end
                  if value.is_a?(Date)
                    format_date(value)
                  elsif value.is_a?(Time)
                    format_time(value)
                  elsif value.respond_to?(:map)
                    value.map(&:to_s).compact.join(',')
                  else
                    value
                  end
                end
            s.to_s
          end
        end
      end
    end
  end
  
  base = Redmine::Export::PDF::IssuesPdfHelper
  patch = Patches::IssuesPdfHelperPatch
  base.send(:include, patch) unless base.included_modules.include?(patch)
  