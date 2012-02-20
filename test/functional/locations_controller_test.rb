require 'test_helper'

class LocationsControllerTest < ActionController::TestCase
  test "location v1 creation" do
    location_params = { timestamp: "2012-02-02",
                 batterylevel: 40,
                 provider: "gps",
                 heading: 120,
                 velocity: 10,
                 position: { latitude: 45,
                             longitude: -122,
                             accuracy: 100,
                             altitude: 100}}
    params = { :location => location_params,
               :client => {:version => "20100606"}}
    location = {} // mock() is not found
    location.expects(:username=)
    location.expects(:id).returns(1)
    location.expects(:save)
    Location.expects(:v1create).returns(location)
    post :create, params
    assert_response :success
  end
end
