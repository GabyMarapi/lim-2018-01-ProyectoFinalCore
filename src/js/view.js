const paintVisit = document.querySelector('#paintVisit');

const logOut = document.querySelector('#logOut');

logOut.addEventListener('click', (e) => {
  firebase.auth().signOut().then(function () {
    if (e.preventDefault) {
      window.location.assign('index.html')
    }
  }).catch(function (error) {

  });
})

const dbRefPost = firebase.database().ref().child('visit');
dbRefPost.on('value', visitKey => {
  paintVisit.innerHTML = '';
  visitKey.forEach(keys => {
    paintingVisit(keys);
  });
})

const paintingVisit = (visitId) => {
  console.log(visitId.val().name)
  let visit = document.createElement('tr');
  visit.innerHTML = `
    <td class="visit-name" data-toggle="modal" data-target="#exampleModal${visitId.key}">${visitId.val().name}</td>
    <td>${visitId.val().date}</td>
    <td>${visitId.val().entryTime}</td>
    <td id="timeOut${visitId.key}">
      <button type="submit" class="btn btn-outline-danger btn-signout">salir</button>
    </td>
    <td id="departureTime${visitId.key}" style="display: none">
      ${visitId.val().departureTime}
    </td>
    <div class="modal fade" id="exampleModal${visitId.key}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Visitante</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="photo-container">
              <img src="${visitId.val().photoUrl}" class="photo-visit">
            </div>
            <p>Nombre:  ${visitId.val().name}</p>
            <p>Fecha de entrada:  ${visitId.val().date}</p>
            <p>Ingreso:  ${visitId.val().entryTime}</p>
            <p>Salida: ${visitId.val().departureTime} </p>
            <p>Empresa:  ${visitId.val().company}</p>
            <p>Anfitrión:  ${visitId.val().employee}</p>
            <p>Razon de visita:  ${visitId.val().reasonForVisit}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-warning" data-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  `;
  paintVisit.appendChild(visit);

  const timeOut = document.querySelector('#timeOut' + visitId.key);
  const departureTime = document.querySelector('#departureTime' + visitId.key);

  if (visitId.val().departureTime === '-') {
    timeOut.style.display = 'block';
    departureTime.style.display = 'none';
  } else {
    timeOut.style.display = 'none';
    departureTime.style.display = 'block';
  }

  timeOut.addEventListener('click', () => {
    let getCurrentTime = new Date().toString("hh:mm");
    console.log(getCurrentTime);
    updateVisitor(visitId.key, visitId.val().date, visitId.val().entryTime, getCurrentTime, visitId.val().name, visitId.val().dni, visitId.val().photo, visitId.val().photoUrl, visitId.val().company, visitId.val().employee, visitId.val().reasonForVisit);
  })
}
