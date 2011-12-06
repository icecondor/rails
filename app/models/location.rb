class Location < CouchRest::Model::Base
  property :date, Time
  property :position

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
  end
end
