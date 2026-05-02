module Books
  class ProgressBadgeComponent < ViewComponent::Base
    def initialize(progress:)
      @progress = progress
    end
  end
end
