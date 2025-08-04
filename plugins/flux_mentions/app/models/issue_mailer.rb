class IssueMailer < ActionMailer::Base
  
    default from: Setting.mail_from
    
    helper :application
    include ApplicationHelper
  
    def self.default_url_options
      ::Mailer.default_url_options
    end

    def notes_notification(issue, journal, user)
      @issue = issue
      @user = user
      @journal = journal
      mail(to: user.mail, subject:"[ #{@issue.project.name} - #{@issue.tracker.name} ##{@issue.id}] You were mentioned in: #{@issue.subject}")
    end
    
    def description_notification(issue,journal, user)
      @issue = issue
      @user = user
      @journal = journal
      mail(to: user.mail, subject: "[ #{@issue.project.name} - #{@issue.tracker.name} - ##{@issue.id}] You were mentioned in: #{@issue.subject}")
    end

    def new_issue_description(issue,journal, user)
      @issue = issue
      @user = user
      @journal = journal
      @current = User.current.name
      mail(to: user.mail, subject: "[ #{@issue.project.name} - #{@issue.tracker.name} ##{@issue.id}] You were mentioned in: #{@issue.subject}")
    end

  
end