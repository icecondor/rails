require 'test_helper'

class LocationsControllerTest < ActionController::TestCase
  test "location v1 creation" do
    location = { timestamp: "2012-02-02",
                 batterylevel: 40,
                 provider: "gps",
                 heading: 120,
                 velocity: 10,
                 position: { latitude: 45,
                             longitude: -122,
                             accuracy: 100,
                             altitude: 100}}
    post :create, { :location => location,
                    :client => {:version => "20100606"}}
    assert_response :success
  end
end
