class SessionsController < ApplicationController
  # morph this into oauth2/authorize
  def create
    email = params[:email]
    token = params[:oauth_token]
    response = {}
    if email
      user = User.find_by_email(email)
    end
    if token
      user = User.find_by_oauth_token(token)
      if user
        session[:logged_in_user] = user.username
        response.merge!(:status => "OK", :user => user)
        render :json => response
        return # holy cow refactor
      end
    end

    if user
      if params[:password].nil?
        response.merge!(:status => "NEEDPASS")
      else
        if params[:password] == user.password
          session[:logged_in_user] = user.username
          if params[:redirect_uri]
            response = URI.parse(params[:redirect_uri])
            # redirect with token? use fragment?
            response.query = [response.query,
                              "access_token="+user.oauth_token,
                              "token_type=bearer",
                              "email="+user.email].select{|e| e}.join('&')
          else
            response.merge!(:status => "OK", :user => user)
          end
        else
          if params[:error_uri]
            response = URI.parse(params[:error_uri])
            response.query = "email="+params[:email]
            flash[:bad_password] = "incorrect"
          else
            logger.info("given: #{params[:password]} recorded:#{user.password}")
            response.merge!(:status => "BADPASS")
          end
        end
      end
    else
      response.merge!(:status => "NOTFOUND", :email => email)
    end

    if response.is_a?(URI)
      redirect_to response.to_s
    else
      render :json => response
    end
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
