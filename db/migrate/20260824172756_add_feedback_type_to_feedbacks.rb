class AddFeedbackTypeToFeedbacks < ActiveRecord::Migration[7.2]
  def change
    add_column :feedbacks, :feedback_type, :integer, default: 0, null: false
  end
end
