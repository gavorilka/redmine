module Patch
  module IssueCreationPatch
    def self.included(base)
      base.class_eval do
        after_create :send_mail_on_create
        
        def send_mail_on_create
          issue = self
          project = self.project
          users = project.users.to_a.delete_if { |u| (u.type != 'User' || u.mail.empty?) }
          mention_symbol = Setting.plugin_flux_mentions['symbol']
          
          # Scan description for mentions
          if issue.description.present?
            mentioned_users = users.select { |u| issue.description.split(' ').include?("#{mention_symbol}#{u.login}") }
            mentioned_users.each do |mentioned_user|
              if ActionMailer::Base.smtp_settings[:address].present?
                begin
                  IssueMailer.new_issue_description(issue, self, mentioned_user).deliver_now
                rescue Net::SMTPAuthenticationError => e
                  Rails.logger.error "SMTP Error: #{e.message}"
                end
              else
                Rails.logger.info "SMTP settings not configured. Email not sent."
              end
            end
          end
        end
      end
    end
  end
end

Issue.send(:include, Patch::IssueCreationPatch)