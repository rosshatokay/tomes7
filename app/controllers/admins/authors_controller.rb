require "csv"

class Admins::AuthorsController < Admins::BaseController
  layout "dashboard"

  def index
    @authors = Author.with_attached_avatar.all
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
      flash[:success] = "Author created"
      redirect_to admins_authors_path
    else
      flash[:error] = "Something went wrong"
      render :new
    end
  end

  def update
    @author = Author.find(params[:id])

    if @author.update(author_params)
      flash[:success] = "Author details saved"
      redirect_to edit_admins_author_path(@author.hashid)
    else
      flash[:error] = "Something went wrong"
      render :edit
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
