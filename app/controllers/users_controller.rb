class UsersController < ApplicationController

  # ajax call
  def check_email
    respond_to do |format|

      format.html { redirect_to root_path }

      email = params[:email]
      user = User.find_by_email(email)
      if user.nil?
        email_exists = false
        message = "Email is available"
      else
        email_exists = true
        message = "Email is already taken"
      end

      format.json { render json: { email_exists: email_exists, message: message } }
    end
  end

  private
end