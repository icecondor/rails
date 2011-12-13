class LocationsController < ApplicationController
  def create
    user = User.find_by_oauth_token(params[:oauth_token])
    if user
      # translate from v1 Location to v2 Location
      l = params[:location]
      location = Location.v1create(params)
      location.username = user
      location.save
      logger.info("Created #{location.inspect}")
      render :json => {:id => location.id}
    else
      logger.info("User not found for oauth_token: #{params[:oauth_token].inspect}")
      render :text => "", :status => 500
    end
  end
end
