module FluxTags
    def self.settings
      ActionController::Parameters.new(Setting[:plugin_flux_tags])
    end
end