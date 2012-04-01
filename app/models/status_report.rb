class StatusReport < CouchRest::Model::Base
    property :host, String

    view_by :host

  design do
    view :type_count,
         :map => "function(doc) {
             emit(doc.type,1)
           }",
         :reduce => "function(keys, values, rereduce) {
             return sum(values);
           }"
  end
end
