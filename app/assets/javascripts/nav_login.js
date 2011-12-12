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
  $('#signup_form').submit(signup_submit)
  $.colorbox({inline:true, href: $('#signup_form'),
              opacity: 0.99, top: "10%"})
}

function signup_submit(e) {
  signup_clear_errs();
  $.post('/users', {email: $('#signup-email').val(),
                    username: $('#signup-username').val(),
                    password: $('#signup-password').val()
  }, signup_callback)
  return false
}

function signup_clear_errs() {
  $("#signup-username-row").removeClass("error")
  $("#signup-username-err").html('')
  $("#signup-email-row").removeClass("error")
  $("#signup-email-err").html('')
}

function signup_callback(data, status) {
  console.log(data)
  if(data.status == "ERR") {
    if(data.username == "TAKEN") {
      $("#signup-username-row").addClass("error")
      $("#signup-username-err").html('- Taken')
    }
    if(data.email == "TAKEN") {
      $("#signup-email-row").addClass("error")
      $("#signup-email-err").html('- Taken')
    }
  }
}