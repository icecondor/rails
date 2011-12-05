class Location < CouchRest::Model::Base
  design do
    view :last_reports_for_user,
         :map => "function(doc) {
             if(doc.type == 'location') {
               emit([doc.user,doc.date],doc);
             }
           }"
  end
end
