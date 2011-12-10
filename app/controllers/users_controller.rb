class UsersController < ApplicationController
  def create
    u_e = User.find_by_email(params[:email])
    u_u = User.find_by_username(params[:username])
    response = {}
    response.merge!({:email => "TAKEN"}) if u_e
    response.merge!({:username => "TAKEN"}) if u_u
    if u_e.nil? && u_u.nil?
      user = User.create(params)
      response.merge!({:status => "OK"})
    else
      response.merge!({:status => "ERR"})
    end
    render :json => response
  end
end
