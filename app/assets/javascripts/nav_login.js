function login_submit(email) {
  console.log('login_submit')
  if(email.length > 0) {
    console.log(email)
    $.post('/session', {email: email}, login_callback)
  } else {
    $('#login-email').focus();
  }
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
  $.post('/session', {email: email, password: password}, login_password_callback)
}

function login_password_callback(data, status){
  console.log("login_password_callback")
  console.log(data)
  if (data.status == "OK") {
    $.colorbox.close();
    $.post('/session', {oauth_token: data.user.oauth_token})
    login_success(data.user)
    iceCondor.api({type:"auth", oauth_token: data.user.oauth_token})
  }
  if (data.status == "BADPASS") {
    $('#full-login-password-err').html(' - Wrong')
    $('#full-login-password-row').addClass('error')
  }
  if (data.status == "NOLOGIN") {
    logout_callback()
  }
}

function auth_callback(data) {
  console.log("auth_callback")
  console.log(data)
}

function login_verify() {
  console.log('login_verify')
  $.get('/session', function(data) {
    if (data.status == "OK") {
      login_success(data.user)
      iceCondor.api({type: "auth", oauth_token: data.user.oauth_token})
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
  current_user = user
  $(".navbar #signing_in").hide()
  $(".navbar #signin_password").hide()
  $(".navbar #logged_in .username").append(
           $("#loggedInUserTemplate").render({
                    username: user.username,
                    url: "/"+user.username}))
  $(".navbar #logged_in").show()
}

function logout_submit() {
  $.ajax({
    type: 'DELETE',
    url: '/session',
    success: logout_callback
  });
}

function logout_callback() {
  $(".navbar #logged_in").hide()
  $(".navbar #signing_in").show()
  $(".navbar #logged_in .username").empty()
}