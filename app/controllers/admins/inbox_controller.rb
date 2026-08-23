class Admins::InboxController < Admins::BaseController
  def index
    f_scope = Feedback.includes(user: [avatar_attachment: :blob]).all.order(created_at: :desc)
    # @pagy, @feedbacks = pagy(f_scope, limit: 10)
    data = f_scope.map { |f|
      {
        user: {
          username: f.user.username,
          avatar_url: f.user.get_avatar_url,
        },
        content: {
          subject: f.subject,
          body: f.body,
        },
        id: f.hashid,
        created_at: f.created_at,
      }
    }

    render inertia: "Admin/Inbox", props: {
             messages_count: Feedback.count,
             messages: InertiaRails.defer { data },
           }
  end

  def destroy
    if params[:ids] === [""]
      flash.inertia[:toast] = { description: "Couldn't find messages" }
      redirect_back(fallback_location: admins_inbox_index_path)
      return
    end

    messages = Feedback.where(id: Feedback.decode_id(params[:ids]))

    if messages.destroy_all
      flash.inertia[:toast] = { description: "Messages deleted" }
      redirect_back_or_to(admins_inbox_index_path)
    else
      flash.inertia[:toast] = { description: "Failed to delete messages" }
      redirect_back_or_to(admins_inbox_index_path)
    end
  end

  def show
    @feedback = Feedback.find(params[:id])
    @breadcrumbs = [{ label: "Home", path: root_path }, { label: "Feedbacks", path: admins_feedbacks_path }, { label: "##{@feedback.hashid}" }]
  end
end
