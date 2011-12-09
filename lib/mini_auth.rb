module MiniAuth
  def current_user
    @current_user
  end

  def login(user)
    @current_user = user
  end

  def logout
    @current_user = nil
  end

  def logged_in?
    !!@current_user
  end
end
