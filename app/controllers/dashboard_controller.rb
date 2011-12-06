class DashboardController < ApplicationController
  def map
    @locations = {}
    Location.recent_users.each{|user| @locations[user] = Location.last_for(user, 1)}
  end
end
