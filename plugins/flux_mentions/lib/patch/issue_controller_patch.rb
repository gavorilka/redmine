module Patch
  module IssueControllerPatch
    def self.included(base)
      base.class_eval do
      
        after_create :send_mail



        def send_mail
          if self.journalized.is_a?(Issue)
            issue = self.journalized
            project = self.journalized.project
            users = project.users.to_a.delete_if { |u| (u.type != 'User' || u.mail.empty?) }
            mention_symbol = Setting.plugin_flux_mentions['symbol']
            
            # Scan description for mentions
            if self.journalized.description.present? 
              mentioned_users = users.select { |u| self.journalized.description.split(' ').include?("#{mention_symbol}#{u.login}") }
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

            # Scan notes for mentions
            if self.notes.present?
              mentioned_users = users.select { |u| self.notes.split(' ').include?("#{mention_symbol}#{u.login}") }
              mentioned_users.each do |mentioned_user|
                if ActionMailer::Base.smtp_settings[:address].present?
                  begin
                    IssueMailer.notes_notification(issue, self, mentioned_user).deliver_now
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
end

Journal.send(:include, Patch::IssueControllerPatch)
