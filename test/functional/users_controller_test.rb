require 'test_helper'

class UsersControllerTest < ActionController::TestCase

  test "create" do

    post :create
    assert_response :success
  end
end
