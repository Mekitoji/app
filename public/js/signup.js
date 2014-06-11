var btn = document.getElementById('form-btn');

var checkPassword = function() {
  var pw = document.getElementById('form-password'),
    pwRpt = document.getElementById('form-password-repeat'),
    message = document.getElementById('confirmMessage');

  var pass = '#ffffff',
    fail = '#ffaaaa';

  if (pw.value.length) {

  }


  if (pw.value == pwRpt.value) {
    pwRpt.style.backgroundColor = pass;
    message.innerHTML = "";
  } else {
    pwRpt.style.backgroundColor = fail;
    message.innerHTML = "Passwords Do Not Match!";
  }
}

btn.addEventListener('click', checkPassword, true);