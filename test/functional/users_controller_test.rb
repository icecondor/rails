require 'test_helper'

class UsersControllerTest < ActionController::TestCase

  test "create" do
    User.expects(:create)
    post :create, {:user => {:email => "user@somewhere",
                             :username => "thisguy"}}
    assert_response :success
  end
end
