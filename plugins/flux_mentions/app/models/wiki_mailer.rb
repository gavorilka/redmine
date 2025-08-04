class WikiMailer < ActionMailer::Base
     layout 'mailer'
    default from: Setting.mail_from
    
    helper :application
    include ApplicationHelper
  
    def self.default_url_options
      ::Mailer.default_url_options
    end

    def wiki_notification(wiki, content , user  )
        @wiki = wiki
        @user = user
        @content = content
        @current = User.current.name
        
        mail(to: user.mail, subject: "[#{@wiki.project.name} ##{@wiki.id}] You were mentioned in wiki ")
      end

 end