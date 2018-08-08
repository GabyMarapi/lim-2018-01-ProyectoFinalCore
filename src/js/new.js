// let date, entryTime, name, dni, photo, photoUrl, employee, reasonForVisit, observations;
// let entryDate = document.getElementById('dateVisit');
// let entryTime = document.querySelector('#entryTimeVisit');
let entryDate, entryTime;
const name = document.querySelector('#nameVisit');
const dni = document.querySelector('#dniVisit');
const setFile = document.querySelector('#selectPhoto');
const reasonForVisit = document.querySelector('#reasonForVisit');
const company = document.querySelector('#company');
const employeeSelect = document.querySelector('#employee');
const submitVisit = document.querySelector('#submit');
const takePhoto = document.querySelector('#takePhoto');
const getOut = document.querySelector('#getOut');
const btnClose = document.querySelector('#btnClose');
const video = document.getElementById('player'),
  image = document.getElementById('output'),
  capture = document.getElementById('capture'),
  canvas = document.getElementById('canvas'),
  player = document.getElementById('player');
const nameInvalid = document.querySelector('#nameInvalid');
const documentInvalid = document.querySelector('#documentInvalid');
const photoInvalid = document.querySelector('#photoInvalid');
const companyInvalid = document.querySelector('#companyInvalid');
const hostInvalid = document.querySelector('#hostInvalid');
const reasonInvalid = document.querySelector('#reasonInvalid');
const checkbox = document.querySelector('#customControlValidation1');
const checkboxInvalid = document.querySelector('#checkboxInvalid');

const logOut = document.querySelector('#logOut');

logOut.addEventListener('click', (e) => {
  firebase.auth().signOut().then(function () {
    if (e.preventDefault) {
      window.location.assign('index.html')
    }
  }).catch(function (error) {

  });
})

takePhoto.addEventListener('click', () => {
  //Activando la camara
  navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
  navigator.getMedia({
    video: true,
    audio: false
  }, (stream) => {
    //URL local de la foto
    video.src = window.URL.createObjectURL(stream);
    video.autoplay = true;
    //video.play();
    var track = stream.getTracks()[0]; // if only one media track
    stopCamera(track)
  }, (error) => {
    console.log(error);
  })
});
const stopCamera = (track) => {
  getOut.addEventListener('click', () => {
    track.stop();
  })
  btnClose.addEventListener('click', () => {
    track.stop();
  })
}
const dataURItoBlob = (dataURI) => {
  // Convertir base64 en datos binarios sin procesar en una cadena
  // No maneja los URI de datos URLEncoded
  const byteString = atob(dataURI.split(',')[1]);
  // Neparar el componente
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  // Escribe los bytes de la cadena en un ArrayBuffer
  const buffer = new ArrayBuffer(byteString.length);
  const view = new DataView(buffer);
  for (let i = 0; i < byteString.length; i++) {
    view.setUint8(i, byteString.charCodeAt(i));
  }
  // Escribe ArrayBuffer en un blob y listo
  return new Blob([buffer], {
    type: mimeString
  });
}

//Función para guardar la foto
const saveVisitorPhoto = (blob) => {
  let photoKey = firebase.database().ref().child('photo').push().key;
  firebase.storage().ref().child(photoKey).put(blob).then(result => {
    let url = result.metadata.downloadURLs[0];
    newVisitEntry(photoKey, url);
  });
}
//Función capturar foto
const takeSnapshot = () => {
  const width = video.videoWidth;
  const height = video.videoHeight;
  const context = canvas.getContext('2d')
  canvas.width = width;
  canvas.height = height;
  context.drawImage(video, 0, 0, width, height);
  const imagUrl = canvas.toDataURL('image/png')
  // image.setAttribute('src', imagUrl)
  const blob = dataURItoBlob(imagUrl);
  saveVisitorPhoto(blob);
}

capture.addEventListener('click', takeSnapshot)

document.addEventListener('DOMContentLoaded', () => {
  //Llenando el select de empresas del anfitrion
  getClients()
    .then((snapshot) => {
      snapshot.forEach(element => {
        company.innerHTML += `<option value="${element.key}">${element.val().company}</option>`;
      });
    })
    .catch((error) => {
      console.log(error);
    });
});


//llamar select de empleados en el evento change del primer select
company.addEventListener('change', () => {
  employee.innerHTML = '';
  employee.innerHTML = '<option selected disabled>Trabajador</option>';
  getEmployees(company.value)
    .then((snapshot) => {
      snapshot.forEach(element => {
        employee.innerHTML += `<option value="${element.key}">${element.val().fullname}</option>`;
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

// const newVisitEntry = (photo, photoUrl) => {
submitVisit.addEventListener('click', newVisitEntry = (photo, photoUrl) => {
  const selectedCompany = company.options[company.selectedIndex].text;
  const selectedEmployee = employee.options[employee.selectedIndex].text;
  console.log(selectedEmployee)

  entryDate = new Date().toString("yyyy-MM-dd");
  entryTime = new Date().toString("hh:mm");

  if (!!name.value && !!dni.value && !!photo && !!photoUrl && !!selectedCompany && !!selectedEmployee && !!reasonForVisit.value) {
    newVisit(entryDate, entryTime, name.value, dni.value, photo, photoUrl, selectedCompany, selectedEmployee, reasonForVisit.value);
    const dbRefPost = firebase.database().ref().child('employees');
    dbRefPost.once('value', visitKey => {
      visitKey.forEach(keys => {
        if (employee.value === keys.key) {
          sendMail(keys.val().email, keys.val().fullname, name.value)
        }
      });
    })
    setTimeout(() => {
      window.location.href = 'successful.html';
    }, 1000)
  } else {
    if (!name.value) {
      nameInvalid.style.display = 'block';
    } else {
      nameInvalid.style.display = 'none';
    }
    if (!dni.value || !/^([0-9]{8,9})*$/.test(dni.value)) {
      documentInvalid.style.display = 'block';
    } else if(!!dni.value && /^([0-9]{8,9})*$/.test(dni.value)){
      documentInvalid.style.display = 'none';
    }
    if (!photo || !photoUrl) {
      photoInvalid.style.display = 'block';
    } else {
      photoInvalid.style.display = 'none';
    }
    if (selectedCompany === 'Empresa comunera') {
      companyInvalid.style.display = 'block';
    } else {
      companyInvalid.style.display = 'none';
    }
    if (selectedEmployee === 'Comunero' || selectedEmployee === 'Trabajador') {
      hostInvalid.style.display = 'block';
    } else {
      hostInvalid.style.display = 'none';
    }
    if (!reasonForVisit.value) {
      reasonInvalid.style.display = 'block';
    } else {
      reasonInvalid.style.display = 'none';
    }
    if (checkbox.checked === false) {
      checkboxInvalid.style.display = 'block';
    }
  }

});

checkbox.addEventListener('click', () => {
  if (checkbox.checked == true) {
    checkboxInvalid.style.display = "none";
  }
});
name.addEventListener('keyup', () => {
  nameInvalid.style.display = "none";
});
dni.addEventListener('keyup', () => {
  documentInvalid.style.display = "none";
});
reasonForVisit.addEventListener('keyup', () => {
  reasonInvalid.style.display = "none";
});
company.addEventListener('change', () => {
  companyInvalid.style.display = "none";
});
employeeSelect.addEventListener('change', () => {
  hostInvalid.style.display = "none";
});

sendMail = (email, name, visitorName) => {
  $.ajax({
    type: 'POST',
    url: 'https://mandrillapp.com/api/1.0/messages/send.json',
    data: {
      'key': 'ZGiSDAUGJIgaCMIqm9ysPA',
      'message': {
        'from_email': 'vbiaggi10@laboratoria.la',
        'to': [{
          'email': email,
          'name': name,
          'type': 'to'
        }],
        'autotext': 'true',
        'subject': '¡TU VISITA HA LLEGADO!',
        'html': visitorName + ' ya llegó y se encuentra en recepción esperándote. Ve a darle el encuentro. ¿¡Qué esperas!?'
      }
    }
  }).done(function (response) {
    console.log(response); // if you're into that sorta thing
  });
}
