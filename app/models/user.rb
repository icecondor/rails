class User < CouchRest::Model::Base
  property :username, String
  property :profile_image_url, String
  property :email, String

  design do
    view :by_username,
         :map => "function(doc) {
             if(doc.type == 'user') {
               emit(doc.username,doc);
             }
           }"
    view :by_email,
         :map => "function(doc) {
             if(doc.type == 'user') {
               emit(doc.email,doc);
             }
           }"
  end

  def self.find_by_username(username)
    return if username.nil?
    user = by_username.key(username).rows.first
    user.value if user
  end

  def self.find_by_email(email)
    return if email.nil?
    user = by_email.key(email).rows.first
    user.value if user
  end

end
