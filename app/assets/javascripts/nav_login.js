function login_submit(email) {
  console.log('login_submit')
  console.log(email)
  $.post('/session', {email: email}, login_callback)
}

function login_callback(data, status) {
  console.log("login_callback.")
  console.log(data)
  if(data.status == "NOTFOUND") {
    new_user_form(data)
  }
  if(data.status == "NEEDPASS") {
    $('#full-login-password-err').html('')
    $('#full-login-email').val($('#login-email').val())   
    $('#full-login-password-row').removeClass('error')
    $.colorbox({inline:true, href: $('#full-login-form'),
            opacity: 0.99, top: "10%",
            onComplete:function() { $('#full-login-password').focus()}})
  }
}

function login_password(email, password) {
  console.log("login_password email:"+email+" password:"+password)
  iceCondor.api({type:"auth", email:email, password: password})
  $.post('/session', {email: email, password: password}, password_callback)
}

function password_callback(data) {
  console.log("password_callback")
  console.log(data)
  if (data.status == "OK") {
    $.colorbox.close();
    login_success(data.user) 
  }
  if (data.status == "BADPASS") {
    $('#full-login-password-err').html(' - Wrong')
    $('#full-login-password-row').addClass('error')
  }
}

function login_verify() {
  $.get('/session', function(data) {
    if (data.status == "OK") {
      login_success(data.user) 
    }
    if (data.status == "NOLOGIN") {
      logout_callback()
    }
  })
}

function new_user_form(data) {
  console.log("new_user_form")
  console.log(data)
  $('#signup-email').val(data.email)
  $.colorbox({inline:true, href: $('#signup_form'),
              opacity: 0.99, top: "10%"})
}

function signup_submit(e) {
  signup_clear_errs();
  var form = e.target;
  $.post('/users', {"user[email]": form.email.value,
                    "user[username]": form.username.value,
                    "user[password]": form.password.value
  }, function(data,status){signup_callback(data,status,form)})
  return false
}

function signup_clear_errs() {
  $("#signup-username-row").removeClass("error")
  $("#signup-username-err").html('')
  $("#signup-email-row").removeClass("error")
  $("#signup-email-err").html('')
}

function signup_callback(data, status, form) {
  console.log("signup_callback")
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
  if(data.status == "OK") {
    $.colorbox.close();
    login_password(form.email.value, form.password.value);
  }
}

function login_success(user) {
  console.log(user)
  $(".topbar #signing_in").hide()
  $(".topbar #signin_password").hide()
  $(".topbar #logged_in .username").html(user.username)
  $(".topbar #logged_in").show()
}

function logout_submit() {
  $.ajax({
    type: 'DELETE',
    url: '/session',
    success: logout_callback
  });
}

function logout_callback() {
  $(".topbar #logged_in").hide()
  $(".topbar #signing_in").show()  
}