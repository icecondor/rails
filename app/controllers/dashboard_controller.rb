class DashboardController < ApplicationController
  def map
    count = params[:count]
    last_usernames = Location.last_users
    last_usernames = last_usernames.select do |username|
      user = User.find_by_username(username)
      user.friends.include?('frontpage') if user
    end
    @group = build_javascript_initial_locations(last_usernames,count)
  end

  private

  def build_javascript_initial_locations(usernames, count)
    usernames.inject({}) do |hash, username|
      user = User.find_by_username(username)
      if user
        hash[username] = { :username => user.username,
                           :marker_image_filename => user.marker_image_filename,
                           :locations => [],
                           :initial_locations => Location.last_for(username, count || 10),
                           :markers => []
                         }
      end
      hash
    end
  end
end
