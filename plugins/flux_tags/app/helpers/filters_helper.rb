module FiltersHelper
    def link_to_filter(title, filters, options = {})
      options.merge!(link_to_filter_options(filters))
      link_to(title, options)
    end
  
    def link_to_filter_options(filters)
      default_options = default_filter_options || {}
      default_options = default_options.merge(fields: [], values: {}, operators: {}, f: [], v: {}, op: {})
      options = default_options.dup
      filters.each do |f|
        name, operator, value = f
    
        options[:fields].push(name)
        options[:f].push(name)
    
        options[:operators][name] = operator
        options[:op][name] = operator
    
        options[:values][name] = [value]
        options[:v][name] = [value]
      end
    
      options
    end
    
  
    def default_filter_options
      controller_name = controller.controller_name
      if controller_name == 'timelog'
        { controller: 'timelog', action: 'index', set_filter: 1 }
      elsif controller_name == 'projects'
        { controller: 'projects', action: 'index', set_filter: 1 }
      elsif controller_name == 'issues'
        { controller: 'issues', action: 'index', set_filter: 1 }
      end
    end
  end