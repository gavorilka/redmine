# Plugin's routes
# See: http://guides.rubyonrails.org/routing.html

# get '/projects/:id/active_memberss' , to: 'issue_tables#fetch_active_members'

# get '/issues/:id/allowed_status', to: 'issue_tables#fetch_issue_allowed_status'

# get '/all_custom_fields', to: 'issue_tables#all_custom_fields'
# get '/all_projects', to: 'issue_tables#all_projects'
# get ':id/all_versions', to: 'issue_tables#all_versions'
# get ':id/check_agile_board_enabled', to: 'issue_tables#check_agile_board_enabled'

# get '/issue_images', to: 'issue_tables#issue_images'
# # put '/projects/:id', to: 'issue_tables#create'


get '/projects/:id/active_memberss' , to: 'issue_tables#fetch_active_members'

get '/issues/:id/allowed_status', to: 'issue_tables#fetch_issue_allowed_status'

get '/all_custom_fields', to: 'issue_tables#all_custom_fields', defaults: { format: :json }
get '/all_projects(.:format)', to: 'issue_tables#all_projects' , defaults: { format: :json }
get ':id/all_versions', to: 'issue_tables#all_versions'
get ':id/check_agile_board_enabled', to: 'issue_tables#check_agile_board_enabled'

get '/issue_images', to: 'issue_tables#issue_images'
# put '/projects/:id', to: 'issue_tables#create'

# Swagger routes for documentation
get '/inplace_issue_editor/api_doc', to: 'inplace_issue_editor_swagger#index'
get '/inplace-issue-editor-api.yaml', to: 'inplace_issue_editor_swagger#swagger', defaults: { format: :yaml }
match '*path', to: 'inplace_issue_editor_swagger#preflight', via: :options