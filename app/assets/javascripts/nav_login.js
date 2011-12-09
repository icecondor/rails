function login_submit() {
  $.post('/session', {email: $('#login-email').val()}, login_callback)
  return false
}

function login_callback(data, status) {
  if(data.status == "NOTFOUND") {
    new_user_form(data)
  }
}

function new_user_form(data) {
  $('#signup-email').val(data.email)
  $.colorbox({inline:true, href: $('#signup_form'),
              opacity: 0.99, top: "10%"})
}