class StaticController < ApplicationController
  allow_unauthenticated_access

  def index
    @features = [
      {
        badge_label: "Digital library",
        heading: "A library that never closes, wherever you are",
        description: "Explore a growing collection of public domain classics, spanning genres, eras, and cultures. Your library is always open and ready.",
      },
      {
        badge_label: "Digital library",
        heading: "A personalized beautiful reading experience",
        description: "Bookmark pages, save your favorite books, and pick up right where you left off—on any device. Build your own personal reading space.",
      },
      {
        badge_label: "Digital library",
        heading: "Share your voice and mark on every book",
        description: "Write reviews, rate books, and discover what others are saying before you dive in. Join a community of readers and help others find their next great read.",
      },
    ]
    @stats = [
      {
        icon: "ph-books",
        heading: Book.all.size,
        description: "Free books spanning dozens of genres, eras, and cultures.",
      },
      {
        icon: "ph-flower-tulip",
        heading: "100%",
        description: "Completely free. No subscriptions. No hidden fees.",
      },
      {
        icon: "ph-devices",
        heading: "Zero",
        description: "Apps required. Read everything on a single platform.",
      },
    ]

    @featured_books = Book.includes(:cover_attachment, :authors, :category).order(created_at: :desc).first(14)
    @page_description = "Read timeless and classic books for free. In one beautiful reading app."
  end

  def terms
    @breadcrumbs = [{ label: "Home", path: root_path }, { label: "Terms of service" }]
    @markdown_file = File.read(Rails.root.join("lib/articles/terms.md"))

    set_meta_tags(reverse: true)
  end

  def community_guidelines
    @breadcrumbs = [{ label: "Home", path: root_path }, { label: "Community guidelines" }]
    @markdown_file = File.read(Rails.root.join("lib/articles/community_guidelines.md"))
    set_meta_tags(reverse: true)
  end

  def privacy
    @breadcrumbs = [{ label: "Home", path: root_path }, { label: "Privacy policy" }]
    @markdown_file = File.read(Rails.root.join("lib/articles/privacy.md"))

    set_meta_tags(reverse: true)
  end

  def about
    @breadcrumbs = [{ label: "Home", path: root_path }, { label: "About" }]
    set_meta_tags(reverse: true, title: "About", og: { title: "About | Tomes", description: :description })
  end
end
