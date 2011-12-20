class ApplicationController < ActionController::Base
  protect_from_forgery
  helper MiniAuth
  include MiniAuth

  before_filter :auth

  def auth    
    logger.info("session logged_in_user #{session[:logged_in_user]}")
    login(session[:logged_in_user])
  end

end
