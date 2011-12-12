module MiniAuth
  def current_user
    @current_user
  end

  def login(username)
    @current_user = User.find_by_username(username)
  end

  def logout
    @current_user = nil
  end

  def logged_in?
    !!@current_user
  end
end
