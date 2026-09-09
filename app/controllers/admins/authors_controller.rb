require "csv"

class Admins::AuthorsController < Admins::BaseController
  def index
    scope = Author.with_attached_avatar.all

    if params[:q].present?
      scope = scope.where("full_name ILIKE ?", "%#{params[:q]}%")
    end

    @pagy, authors = pagy(scope, limit: 15)

    render inertia: "Admin/Authors", props: {
      authors_count: authors.count,
      authors: authors.map { |a|
        {
          id: a.hashid,
          full_name: a.full_name,
          created_at: a.created_at,
          avatar_url: a.get_avatar_url,
          books_count: a.books_count,
        }
      },
      pagination: create_pagination(@pagy),
    }
  end

  def edit
    @author = Author.find(params[:id])
    @breadcrumbs = [
      { label: "Home", path: admins_root_path },
      { label: "Authors", path: admins_authors_path },
      { label: @author.full_name },
    ]
  end

  def new
    @breadcrumbs = [
      { label: "Authors", path: admins_authors_path },
      { label: "New author" },
    ]

    @author = Author.new
  end

  def create
    @author = Author.build(author_params)

    if @author.save
      flash.inertia[:toast] = { description: "Author created" }
      redirect_to admins_authors_path
    else
      flash.inertia[:toast] = { description: "Something went wrong" }
      redirect_to admins_authors_path, inertia: {
                                         errors: inertia_errors_for(@author),
                                       }
    end
  end

  def update
    author = Author.find(params[:author][:id]) rescue nil

    if author.nil?
      flash.inertia[:toast] = { description: "Could not find author" }
      redirect_to admins_authors_path, inertia: { errors: [{ author: "Not found" }] }
      return
    end

    if author.update(author_params)
      flash.inertia[:toast] = { description: "Author updated successfully" }
      redirect_to admins_authors_path
    else
      flash.inertia[:toast] = { description: "Something went wrong" }
      redirect_to admins_authors_path, inertia: {
                                         errors: inertia_errors_for(author),
                                       }
    end
  end

  def csv_import
    Prosopite.pause

    file = params[:csv]
    return redirect_to admins_authors_path, alert: "No file uploaded" unless file

    created_count = 0
    errors = []

    # 1. Wrap in a transaction for atomicity
    Author.transaction do
      CSV.foreach(file.path, headers: true).with_index(1) do |row, line_number|
        author = Author.find_or_initialize_by(full_name: row["full_name"]&.strip)

        # Assign other attributes from CSV
        author.bio = row["bio"]
        author.wiki_url = row["wiki_url"]

        if author.save
          created_count += 1
        else
          errors << "Line #{line_number}: #{author.errors.full_messages.join(", ")}"
        end
      end

      # 3. Optional: Rollback if there are ANY errors
      if errors.any?
        raise ActiveRecord::Rollback
      end
    end

    if errors.any?
      redirect_to admins_authors_path, alert: "Import failed: #{errors.first(3).join(", ")}..."
    else
      redirect_to admins_authors_path, notice: "Successfully imported #{created_count} authors."
    end
  end

  private

  def author_params
    params.require(:author).permit(:avatar, :full_name, :bio, :wiki_url)
  end
end
