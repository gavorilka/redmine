# This file is a part of Redmin CMS (redmine_cms) plugin,
# CMS plugin for redmine
#
# Copyright (C) 2011-2024 RedmineUP
# http://www.redmineup.com/
#
# redmine_cms is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# redmine_cms is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with redmine_cms.  If not, see <http://www.gnu.org/licenses/>.

module RedmineupCms
  module Liquid
    module Tags
      module Part
        # Iclude part content
        #
        #   {% include_part 'part' %}
        #   {% include_part 'main:part' %}
        #   {% include_part page.parts.first %}
        class IncludePart < ::Liquid::Include

          Syntax = /(#{::Liquid::QuotedFragment}+)(\s+(?:with|for)\s+(#{::Liquid::QuotedFragment}+))?/o

          def initialize(tag_name, markup, options)
            super
            raise ::Liquid::Error, "Syntax error {% include_part 'part_name', param1: 'param_value', param1: pages['main'] %}" unless markup =~ Syntax

            @part_var_exp = ::Liquid::Variable.new($1, parse_context)
            @attributes = {}
            markup.scan(::Liquid::TagAttributes) do |key, value|
              @attributes[key] = ::Liquid::Expression.parse(value)
            end
          end

          def render(context)
            part_var = @part_var_exp.render(context)
            part_content = get_part_content(part_var, context)
            raise ::Liquid::Error, "Active part with name '#{part_var}' was not found" unless part_content
            
            partial = ::Liquid::Template.parse(part_content, parse_context)
            context.stack do
              @attributes.each do |key, value|
                context[key] = context.evaluate(value)
              end            
              partial.render(context)
            end

          end          

          private 

          def get_part_content(part_var, context)
            return part_var.content if part_var.is_a?(Redmineup::PartDrop)

            if part_var.match(/(^\S+)?:(.+)$/)
              part_name = $2
              page = CmsPage.find_by_name($1) if part_name && $1
            end
            part_name ||= part_var
            page ||= context.registers[:page]
            part = page.parts.reverse.detect { |p| p.name == part_name }
            part.content
          end

        end



      end

      ::Liquid::Template.register_tag('include_part'.freeze, Part::IncludePart)
    end
  end
end
