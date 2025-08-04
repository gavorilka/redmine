module Patches
    module QueriesHelperPatch
        def self.included(base)
            base.send :include, InstanceMethods
            base.class_eval do
                alias_method :column_content_without_flux_tags, :column_content
                alias_method :column_content, :column_content_with_flux_tags

                alias_method :csv_value_without_tags, :csv_value
                alias_method :csv_value, :csv_value_with_tags
            end 
        end 
    end 

    module InstanceMethods
        include TagsHelper 

        def column_content_with_flux_tags(column, issue)
            if column.name == :tags
                column.value(issue).collect{ |t| render_tag_link(t) }
                .join(FluxTags.settings[:issues_use_colors].to_i > 0 ? ' ' : ' ').html_safe
            else 
                column_content_without_flux_tags(column, issue)
            end 
        end 
        def csv_value_with_tags(column, object, value)
            case column.name
            when :attachments
              value.to_a.map { |a| a.filename }.join("\n")
            when :tags
              value.collect(&:name).join(', ')
            else
              format_object(value, false) do |value|
                case value.class.name
                when 'Float'
                  sprintf("%.2f", value).gsub('.', l(:general_csv_decimal_separator))
                when 'IssueRelation'
                  value.to_s(object)
                when 'Issue'
                  if object.is_a?(TimeEntry)
                    value.visible? ? "#{value.tracker} ##{value.id}: #{value.subject}" : "##{value.id}"
                  else
                    value.id
                  end
                when 'ActiveRecord::Associations::CollectionProxy'
                  value.collect { |v| v.to_s }.join(', ')
                else
                  value
                end
              end
            end
        end
    end 
end 
base = QueriesHelper
patch = Patches::QueriesHelperPatch
base.send(:include, patch) unless base.included_modules.include?(patch)