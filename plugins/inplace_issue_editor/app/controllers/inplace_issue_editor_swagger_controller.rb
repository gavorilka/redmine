class InplaceIssueEditorSwaggerController < ApplicationController
    skip_before_action :check_if_login_required, only: [:index, :swagger, :preflight]
  
    def preflight
      head :ok
    end
  
    def index
      render html: '', layout: 'inplace_issue_editor_swagger_layout', content_type: 'text/html'
    end
  
    def swagger
      yaml_file = Rails.root.join('plugins', 'inplace_issue_editor', 'assets', 'swagger', 'inplace_issue_editor_swagger.yaml')
  
      if File.exist?(yaml_file)
        yaml_content = File.read(yaml_file)
        # server_url = request.base_url
        protocol = Rails.env.production? ? "https" : request.protocol.chomp("://")
        server_url = "#{protocol}://#{request.host_with_port}" 
        yaml_content.gsub!("{server_url}", server_url)
        render plain: yaml_content, content_type: 'application/x-yaml'
      else
        render plain: "inplace_issue_editor_swagger.yaml not found", status: 404
      end
    end
      
  end
  