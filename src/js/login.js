const logIn = document.querySelector('#logIn');
const getEmail = document.querySelector('#validationTooltipUsername');
const getPassword = document.querySelector('#validationTooltipPassword');

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
  signInUser(getEmail.value, getPassword.value,callback);
})