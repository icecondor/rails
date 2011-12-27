class MobileController < ApplicationController
  layout "mobile"

  def login_form
    if params[:email]
      user = User.find_by_email(params[:email])
      if user
        render "login_password"
      else
        redirect_to :action => "signup", :email => params[:email]
      end
    else
      render "login_email"
    end
  end

  def signup
  end
end