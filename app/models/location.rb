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

  view_by :username
  
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
  end

  def self.last_users
    last_report_for_users.reduce.group.rows.map{|r| r.key}.compact
  end

  def self.last_for(user, count=1)
    last = by_username_and_date.startkey([user]).endkey([user,Time.now.utc]).limit(count).rows
    last.map{|l| find(l.id)}
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
