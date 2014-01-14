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
        response.merge!(:status => "OK", :user => safe_user(user))
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
            response.query = Oauth2Util.bearer_token_params(response, user)
          else
            response.merge!(:status => "OK", :user => safe_user(user))
          end
        else
          if params[:error_uri]
            response = URI.parse(params[:error_uri])
            response.query = "email="+URI.encode(params[:email])
            flash[:bad_password] = "incorrect"
          else
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
    logger.info "Checking #{request.session_options[:id]} :logged_in_user = #{session[:logged_in_user].inspect}"
    username = session[:logged_in_user]
    if username
      user = User.find_by_username(username)
      response = {:status => "OK", :user => safe_user(user)}
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

  private
  def safe_user(user)
    {username: user.username, oauth_token: user.oauth_token}
  end
end
