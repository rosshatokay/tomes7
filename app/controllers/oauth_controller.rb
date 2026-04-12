class OauthController < ApplicationController
  allow_unauthenticated_access

  def authorize
    google_url = authorize_client.auth_code.authorize_url(
      redirect_uri: callback_oauth_url,
      scope: "openid email profile",
      access_type: "online",
    )

    redirect_to google_url, allow_other_host: true
  end

  def callback
    # 1. Exchange the code for a token and fetch user data
    token = token_client.auth_code.get_token(
      params[:code],
      redirect_uri: callback_oauth_url,
    )
    user_info_response = token.get("https://openidconnect.googleapis.com/v1/userinfo")
    user_info = JSON.parse(user_info_response.body)

    email_address = user_info["email"]
    uid = user_info["sub"]

    # 2. Find or initialize the identity
    identity = Identity.find_or_initialize_by(provider_name: "Google", provider_uid: uid)

    ActiveRecord::Base.transaction do
      identity = Identity.find_or_initialize_by(provider_name: "Google", provider_uid: uid)

      if identity.new_record?
        # Find user by email or initialize a new one
        user = User.find_or_initialize_by(email_address: email_address)

        # If it's a brand new user record, give them a random password
        if user.new_record?
          user.password = SecureRandom.hex(20)
          user.save!
        end

        identity.user = user
        identity.save!
      else
        user = identity.user
      end

      start_new_session_for(user)

      if user.onboarded?
        redirect_to root_path, notice: "Welcome back!"
      else
        redirect_to onboarding_index_path, notice: "Just one more step!"
      end
    end
  rescue ActiveRecord::RecordInvalid => e
    logger.error "OAuth Validation Error: #{e.record.errors.full_messages.join(", ")}"
    flash[:error] = "Authentication failed: #{e.record.errors.full_messages.first}"
    redirect_to root_path
  rescue StandardError => e
    logger.error "OAuth Error: #{e.message}"
    flash[:error] = "An unexpected error occurred."
    redirect_to root_path
  end

  private

  def authorize_client
    @authorize_client ||= OAuth2::Client.new(
      ENV["GOOGLE_OAUTH_CLIENT_ID"],
      ENV["GOOGLE_OAUTH_CLIENT_SECRET"],
      {
        site: "https://accounts.google.com",
        authorize_url: "/o/oauth2/auth",
      }
    )
  end

  def token_client
    @token_client ||= OAuth2::Client.new(
      ENV["GOOGLE_OAUTH_CLIENT_ID"],
      ENV["GOOGLE_OAUTH_CLIENT_SECRET"],
      {
        site: "https://oauth2.googleapis.com",
        token_url: "/token",
      }
    )
  end
end
