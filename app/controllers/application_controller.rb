class ApplicationController < ActionController::Base
  protect_from_forgery
  helper MiniAuth # available in views
  include MiniAuth # available in controllers

  before_filter :auth

  def auth
    username = session[:logged_in_user]
    if username
      logger.info("logging in from session: #{username}")
      login(username)
    end
  end

end
