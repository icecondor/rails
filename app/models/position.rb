class Position < CouchRest::Model::Base
  property :latitude, Float
  property :longitude, Float
  property :altitude, Float
  property :accuracy, Float
end
