// Elementos que se mostraran en la barra de navegacion y el menu responsivo
var lmsNavBar = [
  {
    title: 'Lista de usuarios',
    ref: 'listaUsuarios.html',
    rol: 'Administrador'
  },
  {
    title: 'Registro de docentes',
    ref: 'registroDocentes.html',
    rol: 'Editor'
  },
  {
    title: 'Lista de docentes',
    ref: 'listaDocentes.html',
    rol: 'Lector'
  },
  {
    title: 'Panel de control',
    ref: 'opciones.html',
    rol: 'Administrador'
  }
];

// Variable que guarda al usuario con sesion iniciada
var currentUser = '';

// Funcion logOutFunction() que realiza el log out del sistema 
logOutFunction = function () {
  // Se ejecuta la funcion signOut() de firebase para el logout del usuario
  firebase.auth().signOut().then(function() {
    console.log('Log out successful');
  }).catch(function(error) {
    console.log('Log out error', error);
  });
}

// 
document.addEventListener('DOMContentLoaded', (e) => {
  // Se captura el elemento <div> con la id "navBar1" para luego realizar la creacion de la barra de navegacion con sus elementos
  var navBar1 = document.getElementById('navBar1');
  // Se crean elementos para el dropdown del las opciones del usuario
  var dropdown1 = createElementFunction('ul', 'dropdown-content', '', 'dropdown1');
  navBar1.appendChild(dropdown1);
  var dropdownPerfil = createElementFunction('li', '', '', '');
  var aDropdownPerfil = createElementFunction('a', '', 'Ver Perfil', '');
  aDropdownPerfil.href = 'perfilUsuario.html';
  dropdownPerfil.appendChild(aDropdownPerfil);
  dropdown1.appendChild(dropdownPerfil);
  // Dropdown para el boton de Log out
  var dropdownLogout = createElementFunction('li', '', '', '');
  var aDropdownLogout = createElementFunction('a', '', 'Log out', '');
  aDropdownLogout.onclick = function () {
    console.log("cerrar sesion");
    logOutFunction();
  }
  dropdownLogout.appendChild(aDropdownLogout);
  dropdown1.appendChild(dropdownLogout);  

  // Se crea la barra de navegacion
  var navElement = createElementFunction('nav', '', '', '');
  navBar1.appendChild(navElement);
  var navWrapper = createElementFunction('div', 'nav-wrapper white', '', '');
  navElement.appendChild(navWrapper);
  var aLogo = createElementFunction('a', 'brand-logo', '', '');
  aLogo.href = 'index.html';
  var imgLogo = createElementFunction('img', 'logo', '', '');
  imgLogo.src = './image/logo jpg de alta resolucion.png';
  aLogo.appendChild(imgLogo);
  navWrapper.appendChild(aLogo);
  var aSideNav = createElementFunction('a', 'sidenav-trigger grey-text', '', '');
  aSideNav.href = '#';
  aSideNav.setAttribute('data-target', 'mobile-demo');
  var sideNavIcon = createElementFunction('i', 'material-icons', 'menu', '');
  aSideNav.appendChild(sideNavIcon);
  navWrapper.appendChild(aSideNav);
  var ulNav = createElementFunction('ul', 'right hide-on-med-and-down', '', 'nav-mobile');
  navWrapper.appendChild(ulNav);
  var ulNavMobile = createElementFunction('ul', 'sidenav', '', 'mobile-demo');  
  navBar1.appendChild(ulNavMobile);
  // Se comprueba que haya un usuario logeado con la funciones de firebase
  firebase.auth().onAuthStateChanged(async function(user) {    
    if (user) {
      currentUser = user;
      // Si el usuario esta logeado se realizan cambios en la barra de navegacion para que se muestre su nombre
      // Variables utilizadas para comprobar la habilitacion del usuario y su rol
      var userRol = '';
      var userEnable = false;
      // Se realiza una consulta a la coleccion 'lms-roles' con la uid del usuario, para obtener el rol del usuario logeado y el estado de habilitacion
      await db.collection("lms-roles").where("idUser", "==", user.uid)
      .get()
      .then(function(querySnapshot) {
        // Se asignan los datos del rol y el estado de habilitacion del usuario en variables
        querySnapshot.forEach(function(doc1) {
          userRol = doc1.data().rolName;
          userEnable = doc1.data().userEnable;
        });                
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
      console.log('User is signed in', user.displayName, userRol);
      // Si el usuario esta habilitado se comprueba que sea administrador, en caso de que no sea administrador se le redirecciona a la pagina 'listaDocentes.html'
      if (userEnable == true) {
        lmsNavBar.forEach(nav => {
          var navLink = false;
          // Se realiza la comprobacion de los roles del usuario, y los elemtnos de la barra de navegacion de acuerdo a sus roles
          if (userRol == 'Administrador') {
            navLink = true;
          }
          if (userRol == 'Editor' && nav.rol != 'Administrador') {
            navLink = true;
          }
          if (userRol == 'Lector' && nav.rol == 'Lector') {
            navLink = true;
          }
          if (navLink) {
            // Se crean los botones de navegacion
            var liNav = createElementFunction('li', '', '', '');
            var navLink = createElementFunction('a', 'grey-text text-darken-1', nav.title, '');
            navLink.href = nav.ref;
            // Mobile sideNavBar
            var liNavMobile = createElementFunction('li', '', '', '');
            var navLinkMobile = createElementFunction('a', '', nav.title, '');
            navLinkMobile.href = nav.ref;
            // Se agrega los botones de navegacion al DOM
            liNav.appendChild(navLink);
            ulNav.appendChild(liNav);
            // Se agrega los botones de navegacion en modo movil al DOM
            liNavMobile.appendChild(navLinkMobile);
            ulNavMobile.appendChild(liNavMobile);
          }
        });
        // Se crea el boton de navegacion de usuario para las opciones de usuario que aparecen en un dropdown
        var liNav = createElementFunction('li', '', '', '');
        var navLink = createElementFunction('a', 'dropdown-trigger grey-text text-darken-1', user.displayName, '');
        navLink.href = '#!';
        navLink.setAttribute('data-target', 'dropdown1');
        liNav.appendChild(navLink);
        ulNav.appendChild(liNav);
        // Se inicializa el dropdown
        var dropdown = document.querySelectorAll('.dropdown-trigger');
        M.Dropdown.init(dropdown);

        // Se crean los links para las opciones de usuario en el menu movil
        var liNavMobilePerf = createElementFunction('li', '', '', '');
        var navLinkMobilePerf = createElementFunction('a', '', 'Ver Perfil', '');
        navLinkMobilePerf.href = 'perfilUsuario.html';
        liNavMobilePerf.appendChild(navLinkMobilePerf);

        var liNavMobileLogout = createElementFunction('li', '', '', '');
        var navLinkMobileLogout = createElementFunction('a', '', 'Log out', '');
        navLinkMobileLogout.onclick = function () {
          console.log('cerrar sesion movil');
          logOutFunction();
        }
        liNavMobileLogout.appendChild(navLinkMobileLogout);
        // Se agrega los botones de navegacion en el menu movil al DOM
        ulNavMobile.appendChild(liNavMobilePerf);
        ulNavMobile.appendChild(liNavMobileLogout);
      }else{
        // En el caso de que el usuario no este habilitado se le redirecciona a la pagina 'deshabilitado.html'
        location.href = 'deshabilitado.html';
      }
    } else {
      // En caso de que el usuario no este logeado se le redirecciona a la pagina 'index.html'
      console.log('User is signed out');
      location.href = 'index.html';
    }
  });
  // Se inicializa la barra de navegacion
  var elems = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems);
})
