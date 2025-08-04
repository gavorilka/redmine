class TagSwaggerController < ApplicationController
  skip_before_action :check_if_login_required, only: [:index, :swagger, :preflight] 
 
  def preflight 
    head :ok 
  end 
 
  def index 
    render html: '', layout: 'tag_swagger', content_type: 'text/html' 
  end 
 
  def swagger 
    yaml_file = Rails.root.join('plugins', 'flux_tags', 'assets', 'swagger', 'tag_swagger.yaml') 
 
    if File.exist?(yaml_file) 
      yaml_content = File.read(yaml_file) 
      protocol = Rails.env.production? ? "https" : request.protocol.chomp("://")
      server_url = "#{protocol}://#{request.host_with_port}" 
      yaml_content.gsub!("{server_url}", server_url) 
      render plain: yaml_content, content_type: 'application/x-yaml' 
    else 
      render plain: "tag_swagger.yaml not found", status: 404 
    end 
  end 
end