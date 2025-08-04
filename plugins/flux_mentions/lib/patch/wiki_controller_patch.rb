module Patch
  module WikiControllerPatch
    def self.included(base)
      base.class_eval do
        before_action :send_mail_if_mentions, only: [:create, :update]

        def send_mail_if_mentions
          return unless params[:content] && User.current.logged?
          project = @project
          content = params[:content]['text']
          users = project.users.to_a.delete_if { |u| (u.type != 'User' || u.mail.empty?) }
          mention_symbol = Setting.plugin_flux_mentions['symbol']
          
          mentioned_users = users.select { |u| content.split(' ').include?("#{mention_symbol}#{u.login}") }
          mentioned_users.each do |mentioned_user|
            if ActionMailer::Base.smtp_settings[:address].present?
              begin
                WikiMailer.wiki_notification(@wiki, content, mentioned_user).deliver_now
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

WikiController.send(:include, Patch::WikiControllerPatch)
require_dependency 'wiki_controller'