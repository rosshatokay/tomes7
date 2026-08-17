class AuthenticatedConstraint
  def matches?(request)
    session_id = request.cookie_jar.signed[:session_id]
    return false unless session_id

    # Check that the session exists AND the user it belongs to still exists
    Session.exists?(id: session_id) && Session.find(session_id).user.present?
  end
end

Rails.application.routes.draw do
  # Redirect to localhost from 127.0.0.1 to use same IP address with Vite server
  constraints(host: "127.0.0.1") do
    get "(*path)", to: redirect { |params, req| "#{req.protocol}localhost:#{req.port}/#{params[:path]}" }
  end

  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  get "login", to: "sessions#new", as: :new_session
  get "signup", to: "registrations#new", as: :new_user_registration

  scope "/@:username" do
    get "/", to: "users#show", as: :profile
  end

  resource :session, only: [:create, :destroy]
  resources :authors, only: [:show]
  resources :categories, only: [:show]
  resources :books, only: [:index, :show] do
    collection do
      post :save
    end
  end

  namespace :api do
    namespace :v1 do
      resources :search, only: [:index]
      resources :notifications, only: [:index]
    end
  end

  root "feeds#index", constraints: AuthenticatedConstraint.new, as: :authenticated_root
  root to: redirect("/books")

  direct :rails_public_blob do |blob|
    if ENV["ACTIVE_STORAGE_ASSET_HOST"].present?
      # Ensures we don't get double slashes or missing slashes
      "#{ENV["ACTIVE_STORAGE_ASSET_HOST"]}/#{blob.key}"
    else
      # Fallback to standard rails route
      route_for(:rails_blob, blob)
    end
  end
end
