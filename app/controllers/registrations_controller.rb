class RegistrationsController < ApplicationController
  allow_unauthenticated_access

  def new
    render inertia: "Auth/Signup"
  end
end
