module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      # 1. Grab the session_id from the SIGNED cookie (matching your start_new_session_for)
      session_id = cookies.signed[:session_id]

      # 2. Find the session record and the associated user
      # Using 'Session.find_by' ensures we don't throw an error if the ID is missing
      if session = Session.find_by(id: session_id)
        session.user
      else
        reject_unauthorized_connection
      end
    end
  end
end
