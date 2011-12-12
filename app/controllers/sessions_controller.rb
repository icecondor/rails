class SessionsController < ApplicationController
  def create
    email = params[:email]
    response = {}
    user = User.find_by_email(email)
    if user
      if params[:password].nil?
        response.merge!(:status => "NEEDPASS")
      else
        if params[:password] == user.password
          session[:logged_in_user] = user.username
          response.merge!(:status => "OK", :user => user)
        else
          logger.info("given: #{params[:password]} recorded:#{user.password}")
          response.merge!(:status => "BADPASS")
        end
      end
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
