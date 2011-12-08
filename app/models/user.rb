class User < CouchRest::Model::Base
  property :username, String
  property :profile_image_url, String

  design do
    view :by_username,
         :map => "function(doc) {
             if(doc.type == 'user') {
               emit(doc.username,doc);
             }
           }"
  end

  def find_by_username(username)
    user = by_username.key(username).rows.first
    user.value if user
  end

end
