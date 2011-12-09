class UsersController < ApplicationController
  def create
    render :json => {:status => "OK"}
  end
end
