class User < CouchRest::Model::Base
  property :username, String
  property :profile_image_url, String
  property :email, String
  property :password, String
  property :oauth_token, String

  validates :username, :presence => true

  view_by :email
  view_by :username
  view_by :oauth_token

end
