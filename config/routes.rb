class AuthenticatedConstraint
  def matches?(request)
    session_id = request.cookie_jar.signed[:session_id]
    return false unless session_id

    # Check that the session exists AND the user it belongs to still exists
    Session.exists?(id: session_id) && Session.find(session_id).user.present?
  end
end

Rails.application.routes.draw do
  get "authors/show"
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  namespace :api do
    namespace :v1 do
      resources :notifications, only: [:index]
      resources :feedbacks, only: [] do
        collection do
          post "request-book"
        end
      end

      namespace :users do
        resources :books, only: [] do
          collection do
            post :save
          end
          member do
            patch "update-progress"
          end
        end
      end

      resources :authors, only: [] do
        collection do
          get :search
        end
      end

      resources :search, only: [:index]
      resources :tags, only: [:index]

      resources :books, only: [] do
        collection do
          post "generate-toc"
          get :toc
        end
      end
    end
  end

  namespace :admins do
    root "dashboard#index"

    resources :feedbacks
    resources :authors
    resources :books
  end

  resources :passwords, param: :token
  resources :authors, only: [:show, :index]
  resources :ratings, only: [:create]
  resources :onboarding, only: [] do
    collection do
      get :index
      patch :update
    end
  end

  resources :settings do
    collection do
      # get :preferences
      patch :profile
    end
  end

  resource :oauth, only: %i[], controller: "oauth" do
    collection do
      get :authorize
      get :callback
    end
  end

  resources :categories, only: [:show]

  resources :explore, only: [] do
    collection do
      get :index
    end
  end

  resources :books, only: [:show] do
    member do
      get :epub, as: :epub_file
      get :read
    end
  end

  # get "/register/verify", to: "registrations#verify", as: :verify_email
  get "/register", to: "registrations#new", as: :new_registration
  post "/register", to: "registrations#create", as: :registration

  get "/login", to: "sessions#new", as: :new_session
  post "/login", to: "sessions#create", as: :session
  delete "/logout", to: "sessions#destroy", as: :logout

  scope "/@:username" do
    get "/", to: "users#show", as: :profile
    # get "/reviews", to: "users#reviews", as: :reviews_profile
    get "/saved", to: "users#saved", as: :saved_profile
    post "/follow", to: "users#follow", as: :follow_user
    post "/unfollow", to: "users#unfollow", as: :unfollow_user
  end

  constraints AuthenticatedConstraint.new do
    root to: "feeds#index", as: :authenticated_root
  end

  match "/404", to: "errors#not_found", via: :all
  match "/500", to: "errors#internal_server_error", via: :all

  get "/community-guidelines", to: "static#community_guidelines", as: :community_guidelines
  get "/terms", to: "static#terms", as: :terms
  get "/privacy", to: "static#privacy", as: :privacy
  get "/about", to: "static#about", as: :about

  root "static#index"

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
