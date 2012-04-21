class LocationsController < ApplicationController
  def create
    user = User.find_by_oauth_token(params[:oauth_token])
    if user
      # translate from v1 Location to v2 Location
      location = Location.v1create(params[:location], params[:client])

      # assign ownership
      location.username = user.username
      location.save
      logger.info("Created #{location.inspect}")

      render :json => {:id => location.id}
    else
      logger.info("User not found for oauth_token: #{params[:oauth_token].inspect}")
      render :text => "", :status => 500
    end
  end

  def index
    count = params[:limit] ? params[:limit].to_i : 1
    locations = Location.last_for(params[:username], params[:limit])
    render :json => "#{params[:callback]}(#{locations.to_json})"
  end

  def count
    count = 0
    rows = Location.by_date.startkey(params[:hours].to_i.hours.ago).reduce.rows
    if rows.size > 0
      count = rows.first["value"]
    end
    render :json => count
  end
end
