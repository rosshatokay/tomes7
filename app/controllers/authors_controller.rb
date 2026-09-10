class AuthorsController < ApplicationController
  allow_unauthenticated_access except: [:follow, :unfollow]

  def index
    allowed_sorts = {
      "recently-added" => { created_at: :desc },
      "most-followed" => { followers_count: :desc },
    }

    sort_param = params[:sort]
    sort_key = allowed_sorts.key?(sort_param) ? sort_param : "recently-added"

    authors = Author.includes(:books, avatar_attachment: :blob).order(allowed_sorts[sort_key])
    pagy, records = pagy(:countless, authors)

    render inertia: "Authors/Index", props: {
             authors: InertiaRails.scroll(pagy) { records.map { |a| a.to_hash(permalink: author_path(a.slug), current_user: current_user) } },
             current_sort: sort_key,
           }, meta: seo_tags(
             title: user_signed_in? ? "Authors" : "Explore the greatest authors of all time",
             description: "Read the books from the greatest authors of all time. For free.",
           )
  end

  def show
    author = Author.includes(avatar_attachment: :blob).friendly.find(params[:id])

    render inertia: "Authors/Show", props: {
             author: {
               full_name: author.full_name,
               avatar_url: author.avatar.attached? ? author.avatar.service.url(author.avatar.blob.key, transformation: [{ width: 250, height: 250 }]) : nil,
               wiki_url: author.wiki_url,
               bio: author.bio,
               slug: author.slug,
               is_followed: current_user&.follows?(author),
               books_count: author.books_count,
               followers_count: author.followers_count,
               share_url: author_url(author.slug),
             },
             books: author.books.map { |b| b.to_hash(permalink: book_path(b.slug)) },
           }, meta: seo_tags(
             title: author.full_name,
             description: "Read #{author.full_name}'s books. For free.",
           )
  end

  def follow
    if current_user.followees(Author).count >= User::MAX_FOLLOWABLE_AUTHORS_COUNT
      render json: { errors: { author: ["You cannot follow more than 20 authors for now."] } }, status: :unprocessable_entity and return
    end

    author = Author.friendly.find(params[:slug]) rescue nil

    unless author.present?
      render json: { errors: { author: ["Could not find author"] } }, status: :unprocessable_entity and return
    end

    current_user.follow!(author)

    Activities::Logger.followed_an_author(user: current_user, author: author)

    render json: { success: true }
  end

  def unfollow
    author = Author.friendly.find(params[:slug]) rescue nil

    unless author.present?
      render json: { errors: { author: ["Could not find author"] } }, status: :unprocessable_entity and return
    end

    current_user.unfollow!(author)

    render json: { success: true }
  end
end
