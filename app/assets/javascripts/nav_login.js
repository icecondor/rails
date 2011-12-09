function login_submit() {
  $.post('/session', login_callback)
  return false
}

function login_callback(data, status) {
  if(data.status == "NOTFOUND") {
    new_user_form()
  }
}

function new_user_form() {
  
}