class User < CouchRest::Model::Base
  property :username, String
  property :profile_image_url, String
  property :marker_image_filename, String
  property :email, String
  property :password, String
  property :oauth_token, String
  property :friends, [String]
  property :mobile_avatar_url, String
  timestamps!

  validates :username, :presence => true

  view_by :email
  view_by :username
  view_by :oauth_token
  view_by :created_at

  def location_count
    Location.count_for(username)
  end

  def self.generate_token
    chars = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ_abcdefghijkmnopqrstuvwxyz"
    str = ""
    35.times { str += chars[rand(chars.length)] }
    return str
  end

  def self.build_initial_locations(usernames, count)
    usernames.inject({}) do |hash, username|
      user = User.find_by_username(username)
      if user
        hash[username] = { :username => user.username,
                           :marker_image_filename => user.marker_image_filename,
                           :locations => [],
                           :initial_locations => Location.last_for(username, count),
                           :markers => []
                         }
      end
      hash
    end
  end

end
