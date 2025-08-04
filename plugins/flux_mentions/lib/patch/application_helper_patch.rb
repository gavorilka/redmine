module Patch
  module ApplicationHelperPatch
    def self.included(base)
      base.send(:include, InstanceMethods)
      base.class_eval do
        alias_method :parse_redmine_links_without_custom_mentions, :parse_redmine_links
        alias_method :parse_redmine_links, :parse_redmine_links_with_custom_mentions
      end
    end

    module InstanceMethods
      def parse_redmine_links_with_custom_mentions(text, default_project, obj, attr, only_path, options)
        all_symbols = ['@', '$', ':', '~', '!', '%']

        all_symbols.each do |symbol|
          mention_regex = /#{Regexp.escape(symbol)}(?<identifier>[\w.]+)/

          text.gsub!(mention_regex) do |_|
            identifier = Regexp.last_match[:identifier]

            user = User.visible.find_by("LOWER(login) = :s AND type = 'User'", s: identifier.downcase)
            user ? link_to("#{symbol}#{user.firstname+' '+ user.lastname}", { controller: 'users', action: 'show', id: user.id, only_path: only_path }, class: 'user-mention', mention: true) : "#{symbol}#{identifier}"
          end
        end

        text
      end
    end
  end
end

ApplicationHelper.send(:include, Patch::ApplicationHelperPatch)
