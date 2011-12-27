class MobileController < ApplicationController
  layout "mobile"

  def login_form
    if params[:email]
      render "login_password"
    else
      render "login_email"
    end
  end
end