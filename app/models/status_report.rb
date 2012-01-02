class StatusReport < CouchRest::Model::Base
    property :host, String

    view_by :host

end
