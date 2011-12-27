class MobileController < ApplicationController
  layout "bare"

  def login_form
    if params[:email]
      render "login_password"
    else
      render "login_email"
    end
  end
end