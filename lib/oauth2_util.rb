class Oauth2Util
  def self.bearer_token_params(uri, user)
    [uri.query,
     "access_token="+URI.encode(user.oauth_token),
     "token_type=bearer",
     "email="+URI.encode(user.email),
     "username="+URI.encode(user.username)].select{|e| e}.join('&')        
  end
end
