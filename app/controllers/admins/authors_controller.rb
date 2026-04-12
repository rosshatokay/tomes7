class Admins::AuthorsController < Admins::BaseController
  around_action :skip_bullet, only: [:index]
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

  private

  def author_params
    params.require(:author).permit(:avatar, :full_name, :bio, :wiki_url)
  end
end
