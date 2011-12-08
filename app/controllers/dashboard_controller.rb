class DashboardController < ApplicationController
  def map
    usernames = Location.last_users
    @locations = usernames.map {|username| Location.last_for(username, 1).first}
    @users = {}
    usernames.map{|username| @users[username] = User.find_by_username(username)} 
  end
end
