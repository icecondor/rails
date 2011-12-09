class SessionsController < ApplicationController
  def create
    user = User.find_by_email(params[:email])
    if user
      session[:logged_in_user] = user.username
      status = "OK"
    else
      status = "NOTFOUND"
    end
    render :json => {:status => status}
  end
end
