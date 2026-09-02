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

  post "/signup", to: "registrations#create", as: :registration
  delete "logout", to: "sessions#destroy", as: :logout

  # scope "/@:username" do
  #   get "/", to: "users#show", as: :profile
  # end

  resource :session, only: [:create, :destroy]
  resources :users, only: [:show]
  resources :categories, only: [:show]

  resources :books, only: [:index, :show] do
    collection do
      post :save
    end

    get "/read", to: "books#read", as: "read"
    get "/epub", to: "books#epub", as: "epub_file"
  end

  resources :feedbacks, only: [] do
    collection do
      post "book-request", to: "feedbacks#book_request"
    end
  end

  resources :authors, only: [:show, :index] do
    collection do
      post :follow
      post :unfollow
    end
  end

  resources :ratings, only: [:create]

  namespace :api do
    namespace :v1 do
      resources :search, only: [:index]
      resources :notifications, only: [:index]

      resources :ratings, only: [] do
        collection do
          get :show
        end
      end

      namespace :users do
        resources :books, only: [] do
          member do
            patch "update-progress"
          end
        end
      end

      namespace :admins do
        resources :categories, only: [] do
          collection do
            get :index
            get :search
          end
        end

        resources :books, only: [] do
          collection do
            get :show
            get :search
          end
        end

        resources :authors, only: [] do
          collection do
            get :show
            get :search
          end
        end

        resources :tags, only: [] do
          collection do
            get :search
          end
        end
      end
    end
  end

  namespace :admins do
    resources :authors, only: [:index, :update] do
      collection do
        post :create
      end
    end

    resources :activities, only: [:index]

    resources :inbox, only: [:index] do
      collection do
        delete :destroy
      end
    end
    resources :users, only: [:index]
    resources :books

    root "dashboard#index"
  end

  get "/about", to: "static#about"
  get "/terms", to: "static#terms"
  get "/privacy", to: "static#privacy"
  get "/community-guidelines", to: "static#community_guidelines"

  # get "/community", to: "feeds#community"
  get "/library", to: "feeds#library", as: :library

  root to: redirect("/library"), constraints: AuthenticatedConstraint.new, as: :authenticated_root
  root to: redirect("/books")

  resource :oauth, only: %i[], controller: "oauth" do
    collection do
      get :authorize
      get :callback
    end
  end

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
