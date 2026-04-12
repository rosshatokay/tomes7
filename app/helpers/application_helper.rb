module ApplicationHelper
  def render_markdown(content)
    # Initialize the Redcarpet parser
    renderer = Redcarpet::Render::HTML.new(hard_wrap: true, filter_html: true)
    markdown = Redcarpet::Markdown.new(renderer, extensions = {})

    # Return the HTML (safely)
    markdown.render(content).html_safe
  end

  def show_svg(path)
    File.open("app/assets/images/#{path}", "rb") do |file|
      raw file.read
    end
  end

  #
  # @param [String[]] errors
  #
  def input_error_label(errors)
    return unless errors&.any?

    tag.p errors.join(", ").humanize, class: "text-xs text-red-700 dark:text-red-400 mt-2"
  end

  def admin_aside_links
    [
      {
        path: admins_root_path,
        label: "Home",
        icon: "ph-house",
      },
      {
        path: admins_books_path,
        label: "Books",
        icon: "ph-books",
      },
      {
        path: admins_authors_path,
        label: "Authors",
        icon: "ph-address-book",
      },
      {
        path: admins_feedbacks_path,
        label: "Inbox",
        icon: "ph-chat",
      },
      {
        path: "/s",
        label: "Users",
        icon: "ph-users-four",
      },
    ]
  end

  def category_emoji(slug)
    images = {
      "literature": "📚",
      "history": "📜",
      "arts-culture": "🎨",
      "religion-philosophy": "💭",
      "science-technology": "🔬",
      "social-sciences-society": "👥",
      "lifestyle-hobbies": "🏈",
      "health-medicine": "🏥",
      "education-reference": "🎓",
    }

    images.fetch(slug.to_sym)
  end
end
