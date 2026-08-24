class FeedbacksController < ApplicationController
  rate_limit to: 1, within: 24.hours, only: :book_request, with: -> { render json: { message: "You've hit your daily requests limit. Try again tomorrow.", success: false } }

  def book_request
    permitted = request_book_params
    feedback = Feedback.build_book_request(current_user, **permitted.to_h.symbolize_keys)

    if permitted[:book_title].blank? || permitted[:author_name].blank?
      feedback.errors.add(:book_title, "Can't be blank") if permitted[:book_title].blank?
      feedback.errors.add(:author_name, "Can't be blank") if permitted[:author_name].blank?

      flash.inertia[:toast] = { description: "Something went wrong" }
      redirect_back_or_to root_path, inertia: {
                                       errors: inertia_errors_for(feedback),
                                     }
      return
    end

    if feedback.save
      flash.inertia[:toast] = { description: "Request sent. We'll take a look." }
      redirect_back(fallback_location: root_path)
    else
      flash.inertia[:toast] = { description: "Something went wrong" }
      redirect_back_or_to root_path, inertia: {
                                       errors: inertia_errors_for(feedback),
                                     }
    end
  end

  private

  def request_book_params
    params.require(:feedback).permit(:book_title, :author_name)
  end
end
