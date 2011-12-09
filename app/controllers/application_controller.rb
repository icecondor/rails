class ApplicationController < ActionController::Base
  protect_from_forgery
  helper MiniAuth
  include MiniAuth

  before_filter :auth

  def auth    
    login(session[:logged_in_user])
  end

end
