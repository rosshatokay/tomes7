# frozen_string_literal: true

InertiaRails.configure do |config|
  config.version = ViteRuby.digest
  config.encrypt_history = true
  config.always_include_errors_hash = true
  config.use_script_element_for_initial_page = true
  config.use_data_inertia_head_attribute = true

  if Rails.env.production?
    # Production: Talk to your Foreman-managed standalone Node process
    config.ssr_url = ENV.fetch("INERTIA_SSR_URL", "http://127.0.0.1:13714")
    config.ssr_enabled = File.exist?(Rails.root.join("public/vite-ssr/ssr.mjs"))
  else
    # Development: Let @inertiajs/vite automatically proxy SSR to the Vite dev server
    config.ssr_enabled = true
  end

  config.on_ssr_error = ->(error, page) do
    Rails.logger.warn("SSR failed for #{page[:component]}: #{error.message}")
  end
end
