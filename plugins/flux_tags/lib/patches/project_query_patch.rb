module Patches
    module ProjectQueryPatch
  
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
            projects = Project.tagged_with(values_for('tags'), any: true)
          when '!*'
            projects = Project.tagged_with(ActsAsTaggableOn::Tag.all.map(&:to_s), exclude: true)
          else  
            projects = Project.tagged_with(ActsAsTaggableOn::Tag.all.map(&:to_s), any: true)
          end 
        
          compare = operator.eql?('!') ? 'NOT IN' : 'IN'
          ids_list = projects.collect {|project| project.id }.push(0).join(',')
          
          "( #{Project.table_name}.id #{compare} (#{ids_list}) )"
        end
        
  
        def available_filters_with_tags
          if @available_filters.blank?
            available_tags = Project.available_tags.collect {|t| [t.name, t.name]}
            add_available_filter('tags', type: :list_optional, name: l(:field_tags),
                                 values: available_tags) unless available_filters_without_tags.key?('tags')
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
        require 'logger'

        def available_columns_with_tags
          
          
          if @available_columns.blank?
            @available_columns = available_columns_without_tags
            @available_columns << QueryColumn.new(:tags, caption: l(:field_tags))
          else
            @available_columns_without_tags
          end

          
          # Log the values
         
        
          @available_columns
        end
        
      end 
    end
  
    base = ProjectQuery
    patch = Patches::ProjectQueryPatch
    base.send(:include, patch) unless base.included_modules.include?(patch)
  end
  