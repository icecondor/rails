class UsersController < ApplicationController
  def create
    u_e = User.find_by_email(params[:user][:email])
    u_u = User.find_by_username(params[:user][:username])
    response = {}
    if u_e.nil? && u_u.nil?
      logger.info("creating with #{params[:user].inspect}")
      user = User.create(params[:user])
      logger.info("created #{user.inspect}")
      response.merge!({:status => "OK", :user => user})
    else
      response.merge!({:email => "TAKEN"}) if u_e
      response.merge!({:username => "TAKEN"}) if u_u
      response.merge!({:status => "ERR"})
    end
    render :json => response
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
