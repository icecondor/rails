class DashboardController < ApplicationController
  def map
    count = params[:count]
    last_usernames = Location.last_users
    last_usernames = last_usernames.select do |username|
      user = User.find_by_username(username)
      user.friends.include?('frontpage') if user
    end
    @group = User.build_initial_locations(last_usernames,count || 10)
  end

end
