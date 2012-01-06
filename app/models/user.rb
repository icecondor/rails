class User < CouchRest::Model::Base
  property :username, String
  property :profile_image_url, String
  property :marker_image_filename, String
  property :email, String
  property :password, String
  property :oauth_token, String
  property :friends, [String]

  validates :username, :presence => true

  view_by :email
  view_by :username
  view_by :oauth_token

  def location_count
    Location.count_for(username)
  end

  def self.generate_token
    chars = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ_abcdefghijkmnopqrstuvwxyz"
    str = ""
    35.times { str += chars[rand(chars.length)] }
    return str
  end
end
