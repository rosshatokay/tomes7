module Forms
  class SelectComponent < ViewComponent::Base
    def initialize(icon:, option_groups:, url_param:)
      @icon = icon
      @option_groups = option_groups
      @url_param = url_param
    end
  end
end
