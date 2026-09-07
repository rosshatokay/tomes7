class OnboardingController < ApplicationController
  skip_before_action :check_onboarding

  def index
    render inertia: "Users/Onboarding"
  end

  def update
  end
end
