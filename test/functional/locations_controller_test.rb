require 'test_helper'

class LocationsControllerTest < ActionController::TestCase
  # test "the truth" do
  #   assert true
  # end
  test "location creation" do    
    post :create
    assert_response :success
  end
end
