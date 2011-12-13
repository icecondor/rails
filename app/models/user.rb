class User < CouchRest::Model::Base
  property :username, String
  property :profile_image_url, String
  property :email, String
  property :password, String
  property :oauth_token, String

  view_by :email
  view_by :username

end
