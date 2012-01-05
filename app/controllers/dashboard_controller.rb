class DashboardController < ApplicationController
  def map
    count = params[:count]
    last_usernames = Location.last_users
    @group = last_usernames.inject({}) do |hash, username|
      user = User.find_by_username(username)
      hash[username] = user || {}
      hash[username][:locations] = []
      hash[username][:initial_locations] = Location.last_for(username, count || 10)
      hash[username][:markers] = []
      hash
    end
  end
end
