CouchRest::Model::Base.configure do |config|
  config.connection = { :prefix => 'icecondor' }
end

