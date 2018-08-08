const logIn = document.querySelector('#logIn');
const getEmail = document.querySelector('#validationCustomUsername');
const getPassword = document.querySelector('#validationTooltipPassword');
const checkbox = document.querySelector('#customControlValidation1');
const form = document.getElementsByClassName('needs-validation');
const checkboxInvalid = document.querySelector('#checkboxInvalid');
const emailInvalid = document.querySelector('#emailInvalid');
const passwordInvalid = document.querySelector('#passwordInvalid');

window.onload = () => {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      window.location.assign('view.html')
    } else {
      console.log('No user is signed in.');
    }
  });
}
logIn.addEventListener('click', () => {
  const callback = (error, response) => {
    if (!error) {
      window.location.assign('view.html')
    } else {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        alert('La contraseña es muy débil.');
      } else {
        alert(errorMessage);
      }
    }
  }
  if (checkbox.checked === true && getEmail.value === 'admin@gmail.com' && getPassword.value === '123456') {
    signInUser(getEmail.value, getPassword.value, callback);
  } else {
    if (checkbox.checked === false) {
      checkboxInvalid.style.display = 'block';
    }
    if (!getEmail.value || getEmail.value !== 'admin@gmail.com') {
      emailInvalid.style.display = 'block';
    }else{
      emailInvalid.style.display = 'none';
    }
    if (!getPassword.value || getPassword.value !== '123456') {
      passwordInvalid.style.display = 'block';
    }else{
      passwordInvalid.style.display = 'none';
    }
  }
})

checkbox.addEventListener('click', () => {
  if (checkbox.checked == true) {
    checkboxInvalid.style.display = "none";
  }
});
