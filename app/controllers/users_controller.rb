class UsersController < ApplicationController
  def create
    u_e = User.find_by_email(params[:user][:email])
    u_u = User.find_by_username(params[:user][:username])
    response = {}
    if u_e.nil? && u_u.nil?
      params[:user].merge!({:oauth_token => User.generate_token})
      logger.info("creating with #{params[:user].inspect}")
      user = User.create(params[:user])
      logger.info("created #{user.inspect}")
      response.merge!({:status => "OK", :user => user})
    else
      if u_e
        response.merge!({:email => "TAKEN"}) 
        flash[:email_taken]="already in use."
      end
      if u_u
        response.merge!({:username => "TAKEN"})
        flash[:username_taken]="already in use."
      end
      response.merge!({:status => "ERR"})
    end
    if params[:redirect_uri]
      if response[:status] == "OK"
        redirect_to params[:redirect_uri]
      else
        err_uri = URI.parse(params[:error_uri])
        err_uri.query = "email="+params[:user][:email]+"&username="+params[:user][:username]
        redirect_to err_uri.to_s
      end
    else
      render :json => response
    end
  end

  def show
    @user = User.find_by_username(params[:username])
    unless @user
      flash[:error] = "user \"#{params[:username]}\" is unknown"
      redirect_to root_path
      return
    end
  end
end
