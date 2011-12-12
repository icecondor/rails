class SessionsController < ApplicationController
  def create
    email = params[:email]
    response = {}
    user = User.find_by_email(email)
    if user
      session[:logged_in_user] = user.username
      response.merge!(:status => "OK", :user => user)
    else
      response.merge!(:status => "NOTFOUND", :email => email)
    end
    render :json => response
  end

  def show
    username = session[:logged_in_user]
    if username
      user = User.find_by_username(username)
      response = {:status => "OK", :user => user}
    else
      response = {:status => "NOLOGIN"}
    end
     render :json => response
  end

  def destroy
    #session.destroy
    session[:logged_in_user] = nil
    render :json => {:status => "OK"}
  end
end
