class SessionsController < ApplicationController
  def create
    email = params[:email]
    user = User.find_by_email(email)
    if user
      session[:logged_in_user] = user.username
      status = "OK"
    else
      status = "NOTFOUND"
    end
    render :json => {:status => status, :email => email}
  end
end
