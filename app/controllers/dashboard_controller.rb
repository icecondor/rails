class DashboardController < ApplicationController
  def map
    @locations = Location.recent_users.map {|user| Location.last_for(user, 1).first }
  end
end
