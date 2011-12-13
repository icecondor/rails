class LocationsController < ApplicationController
  def create
    user = User.find_by_oauth_token(params[:oauth_token])
    logger.info("Creating location, oauth_token user: #{user}")
    if user
      location = Location.new(params[:location])
      location.username = user
      render :json => {:id => location.id}
    else
      render :text => "", :status => 500
    end
  end
end
