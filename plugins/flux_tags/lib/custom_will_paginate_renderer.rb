# lib/custom_will_paginate_renderer.rb
class CustomWillPaginateRenderer < WillPaginate::ActionView::LinkRenderer

    def container_attributes
      { class: 'pagination' }
    end
  
    def page_number(page)
      if page == current_page
        tag(:li, tag(:span, page), class: 'current')
      else
        tag(:li, link(page, page), class: 'page')
      end
    end
  
    def previous_or_next_page(page, text, classname)
      if page
        tag(:li, link(text, page), class: "#{classname} page")
      else
        tag(:li, tag(:span, text), class: "#{classname} disabled")
      end
    end
  
    def html_container(html)
      tag(:span, tag(:ul, html, class: 'pages'))
    end
  
    def to_html
      html = pagination.map do |item|
        case item
        when :previous_page
          previous_or_next_page(@collection.previous_page, '« Previous', 'previous')
        when :next_page
          previous_or_next_page(@collection.next_page, 'Next »', 'next')
        when :gap
          tag(:li, tag(:span, '…'), class: 'spacer')
        else
          page_number(item)
        end
      end.join(@options[:link_separator])
  
      html = html_container(html)
      html + ' ' + items_info + ' ' + per_page_links 
    end

  
    private
  
    def per_page_links
      per_page_options = [10, 20, 50]
      current_per_page = @collection.per_page
      links = per_page_options.map do |per_page|
        if per_page == current_per_page
          tag(:span, per_page, class: 'selected')
        else
          url = @template.url_for(@options[:params].merge(per_page: per_page))
          link(per_page, url)
        end
      end
      tag(:span, "Per page: #{links.join(', ')}", class: 'per-page')
    end
  
    def items_info
      start_item = @collection.offset + 1
      end_item = @collection.offset + @collection.length
      total_items = @collection.total_entries
      tag(:span, "(#{start_item}-#{end_item}/#{total_items})", class: 'items')
    end
  end
  