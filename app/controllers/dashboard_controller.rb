class DashboardController < ApplicationController
  def map
    last_usernames = Location.last_users
    @locations = last_usernames.map {|username| Location.last_for(username, 1).first}
    @group = last_usernames.inject({}) do |hash, username| 
      hash[username] = User.find_by_username(username)
      hash
    end
  end
end
