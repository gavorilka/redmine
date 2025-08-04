= flux_tags

Description goes here

## Introduction

The Redmineflux Tag Plugin is a powerful plugin for the project management tool that allows users to add tags to various entities. 
Tags provide a flexible and efficient way to categorize and organize information, making it easier to search for and retrieve relevant data.

## Installation

To install Redmineflux Tag Plugin follow these steps

-Make sure you have a working installation of Redmine.
-Download the Tag Plugin from the redmineflux.com website. The plugin typically comes in the form of a ZIP file
-Extract the tag plugin zip file to Redmine’s plugins directory (/path/to/redmine/plugins) and do not change the plugin folder name.
-Run the following command to install the required dependencies
    Bundle install 
-Run migrate command for database migration  
    -> In Production 
        RAILS_ENV=Production bundle exec rails redmine:plugins:migrate 
    –> In Development
        RAILS_ENV=Development bundle exec rails redmine:plugins:migrate 
-Restart Redmine server to load the plugin 
    Rails s


For more information visit this URL

https://www.redmineflux.com/knowledge-base/plugins/tag-plugin/