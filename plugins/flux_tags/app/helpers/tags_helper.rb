
require 'digest/md5'

module TagsHelper
  include ActsAsTaggableOn::TagsHelper
  include FiltersHelper


  def render_tag_link(tag, options = {})
    use_colors = FluxTags.settings[:issues_use_colors].to_i > 0
    if use_colors
      tag_bg_color = tag_color(tag)
      tag_style = "background-color: #{tag_bg_color}; color: black"
    end

    filters = [[:tags, '=', tag.name]]
    filters << [:status_id, 'o'] if options[:open_only]
    if options[:use_search]
      content = link_to tag, { controller: 'search', action: 'index',
        id: @project, q: tag.name, wiki_pages: true, issues: true,
        display_type: 'list' }, style: tag_style
      else
        if params[:controller] == 'settings'
          content = tag.name
        else
          content = link_to_filter tag.name, filters, project_id: @project, display_type: 'list'
        end
      end
    if options[:show_count]
      content << content_tag('span', "(#{ tag.count })", class: 'tag-count')
    end

    style = if use_colors
        { class: 'tag-label-color',
          style: tag_style }
      else
        { class: 'tag-label-without-color' }
      end
    content_tag 'span', content, style
  end

  def tag_color(tag)
    tag_name = tag.respond_to?(:name) ? tag.name : tag
    digest = Digest::MD5.hexdigest(tag_name)[2..7]
    char_mapping = {
      '0' => 'b', '1' => 'c', '2' => 'd',
      '3' => 'e', '4' => 'b', '5' => 'c',
      '6' => 'd', '7' => 'e', '8' => 'b',
      '9' => 'c', 'a' => 'd', 'b' => 'e',
      'c' => 'b', 'd' => 'c', 'e' => 'd',
      'f' => 'e'
    }

    light_color = digest.chars.map { |char| char_mapping[char] }.join
  
    "##{light_color}"
  end


  def render_tags_list(tags, options = {})
    puts "SETTINGSSS"
    unless tags.nil? or tags.empty?
      content, style = '', options.delete(:style)
      tags = tags.to_a
      case sorting = "#{ FluxTags.settings[:issues_sort_by] }:#{ FluxTags.settings[:issues_sort_order] }"
        when 'name:asc'
          tags.sort! {|a, b| a.name <=> b.name }
        when 'name:desc'
          tags.sort! {|a, b| b.name <=> a.name }
        when 'count:asc'
          tags.sort! {|a, b| a.count <=> b.count }
        when 'count:desc'
          tags.sort! {|a, b| b.count <=> a.count }
        else
         
          logger.warn "[flux_tags] Unknown sorting option: <#{ sorting }>"
          tags.sort! {|a, b| a.name <=> b.name }
      end
      if :list == style
        list_el, item_el = 'ul', 'li'
      elsif :simple_cloud == style
        list_el, item_el = 'div', 'span'
      elsif :cloud == style
        list_el, item_el = 'div', 'span'
        tags = cloudify tags
      else
        raise 'Unknown list style'
      end
      content = content.html_safe
      tag_cloud tags, (1..8).to_a do |tag, weight|
        content << ' '.html_safe <<
          content_tag(item_el, render_tag_link(tag, options),
            class: "tag-nube-#{ weight }",
            style: (:simple_cloud == style ? 'font-size: 1em;' : '')) <<
          ' '.html_safe
      end
      content_tag list_el, content, class: 'tags',
        style: (:simple_cloud == style ? 'text-align: left;' : '')
    end
  end

  def render_api_flux_tags(taggable, api)
    api.array :tags do
      taggable.tags.each do |tag|
        api.tag(:id => tag.id, :name => tag.name)
      end
    end if include_in_api_response?('tags')
  end
  


  def csv_value(column, object, value)
    case column.name
    when :attachments
      value.to_a.map {|a| a.filename}.join("\n")
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
          value.collect{|v| v.to_s}.join(',')
        else
          value
        end
      end
    end
  end


  private


  def cloudify(tags)
    temp, tags, trigger = tags, [], true
    temp.each do |tag|
      tags.send (trigger ? 'push' : 'unshift'), tag
      trigger = !trigger
    end
    tags
  end
end