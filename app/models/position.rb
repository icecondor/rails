class Position < CouchRest::Model::Base
  property :provider, String
  property :latitude, Float
  property :longitude, Float
  property :altitude, Float
  property :accuracy, Float
  property :heading, Float
  property :velocity, Float
end