
module IssuesTag
  class ModelIssueHooks < Redmine::Hook::ViewListener
    def controller_issues_edit_before_save(context = {})
      save_tags_to_issue context, true
    end

    def controller_issues_bulk_edit_before_save(context = {})
      bulk_update_tags_to_issues context
    end

    def controller_issues_new_after_save(context = {})
      # save_tags_to_issue context, false
      # context[:issue].save
      issue = context[:issue]
      save_tags_to_issue(issue, false)
    end

    def save_tags_to_issue(context, create_journal)
      params = context[:params]
      issue = context[:issue]
      if params && params[:issue] && !params[:issue][:tag_list].nil?
        old_tags = Issue.find(context[:issue].id).tag_list.to_s
        issue.tag_list = params[:issue][:tag_list]
        new_tags = issue.tag_list.to_s

        issue.save_tags
        create_journal_entry(issue, old_tags, new_tags) if create_journal

        Issue.remove_unused_tags!
      end
    end

    def bulk_update_tags_to_issues(context)
      params = context[:params]
      issue = context[:issue]
      common_tags = []  
      if params[:common_tags].present?
        common_tags = if params[:common_tags].is_a?(String)
                        params[:common_tags].split(ActsAsTaggableOn.delimiter).collect(&:strip)
                      else
                        params[:common_tags].collect(&:strip)
                      end
      end
      tag_list = issue.tag_counts.collect(&:name)
      if common_tags.present?
        current_tags = issue.tag_list
        tags_to_add = tag_list - common_tags
        tags_to_remove = common_tags - tag_list
        if tags_to_add.any? || tags_to_remove.any?
          old_tags = current_tags.to_s
          new_tags = current_tags.add(tags_to_add).remove(tags_to_remove)
          issue.tag_list = common_tags
          issue.save_tags
          create_journal_entry(issue, old_tags, new_tags)
          Issue.remove_unused_tags!
        end
      end
    end    
    def create_journal_entry(issue, old_tags, new_tags)
      if !(old_tags == new_tags || issue.current_journal.blank?)
        issue.current_journal.details << JournalDetail.new(
          property: 'attr', prop_key: 'tag_list', old_value: old_tags.to_s,
          value: new_tags.to_s)
      end
    end
  end

end 