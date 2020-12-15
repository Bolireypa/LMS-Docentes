
var lmsNavBar = [
  {
    title: 'Lista de usuarios',
    ref: 'listaUsuarios.html',
    class: ''
  },
  {
    title: 'Registro de docentes',
    ref: 'resgistroDocentes.html',
    class: ''
  },
  {
    title: 'Lista de docentess',
    ref: 'listaDocentes.html',
    class: ''
  },
  {
    title: 'Panel de control',
    ref: 'opciones.html',
    class: ''
  }
];

document.addEventListener('DOMContentLoaded', (e) => {
  
  var navBar1 = document.getElementById('navBar1');
  var navElement = createElementFunction('nav', '', '', '');
  navBar1.appendChild(navElement);
  var navWrapper = createElementFunction('div', 'nav-wrapper', '', '');
  navElement.appendChild(navWrapper);
  var aLogo = createElementFunction('a', 'brand-logo', 'Co Marca', '');
  aLogo.href = 'index.html';
  navWrapper.appendChild(aLogo);
  var aSideNav = createElementFunction('a', 'sidenav-trigger', '', '');
  aSideNav.href = '#';
  aSideNav.setAttribute('data-target', 'mobile-demo');
  var sideNavIcon = createElementFunction('i', 'material-icons', 'menu', '');
  aSideNav.appendChild(sideNavIcon);
  navWrapper.appendChild(aSideNav);
  var ulNav = createElementFunction('ul', 'right hide-on-med-and-down', '', 'nav-mobile');
  navWrapper.appendChild(ulNav);
  var ulNavMobile = createElementFunction('ul', 'sidenav', '', 'mobile-demo');  
  ulNavMobile.addEventListener('DOMContentLoaded', (e) => {
    $('.sidenav').sidenav();

  })
  navBar1.appendChild(ulNavMobile);
  lmsNavBar.forEach(nav => {
    var liNav = createElementFunction('li', '', nav.title, '');
    ulNav.appendChild(liNav);
    // Mobile sideNavBar
    var liNavMobile = createElementFunction('li', '', nav.title, '');
    ulNavMobile.appendChild(liNavMobile);
  });

})
