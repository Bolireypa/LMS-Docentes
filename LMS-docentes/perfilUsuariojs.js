



document.addEventListener('DOMContentLoaded', (e) => {
  
  $('.tabs').tabs();
  $(".dropdown-trigger").dropdown({ hover: false });
  var collapsibles = document.querySelectorAll('.collapsible');
  var instances = M.Collapsible.init(collapsibles);
})