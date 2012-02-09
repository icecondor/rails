class Location < CouchRest::Model::Base
  property :date, Time
  property :position, Position
  property :username, String
  property :battery_level, Float
  property :provider, String
  property :heading, Float
  property :velocity, Float
  property :client, Client
  timestamps!

  validates :username, :presence => true

  design do
    view :last_report_for_users,
         :map => "function(doc) {
             if(doc.type == 'location') {
               emit(doc.username,doc.date);
             }
           }",
         :reduce => "function(keys, values, rereduce) {
              return values.sort()[0]
           }"
    view :by_username_and_date,
         :map => "function(doc) {
             if(doc.type == 'location') {
               emit([doc.username,doc.date],1);
             }
           }",
         :reduce => "function(keys, values, rereduce) {
              return sum(values);
           }"          

    view :by_username,
         :map => "function(doc) {
             if(doc.type == 'location') {
               emit(doc.username,1);
             }
           }",
         :reduce => "function(keys, values, rereduce) {
              return sum(values);
           }"          
  end

  def self.last_users
    last_report_for_users.reduce.group.rows.map{|r| r.key}.compact
  end

  def self.last_for(user, count=1)
    last = by_username_and_date.startkey([user]).endkey([user,Time.now.utc]).descending.limit(count).rows.reverse
    last.map{|l| find(l.id)}
  end

  def self.count_for(username)
    rows = by_username.key(username).reduce.rows
    rows.length > 0 ? rows.first["value"] : 0
  end

  def self.v1create(v1, client)
    new({:date => v1[:timestamp],
         :battery_level => v1[:batterylevel],
         :provider => v1[:provider],
         :heading => v1[:heading],
         :velocity => v1[:velocity],
         :position => {:latitude => v1[:latitude],
                       :longitude => v1[:longitude],
                       :accuracy => v1[:accuracy],
                       :altitude => v1[:altitude]},
         :client => {:version => client[:version]}})
  end
end
