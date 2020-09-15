// $(document).ready(function () {
//     $(".sidenav li").click(() => {
//       $(".sidenav").sidenav("close");
//     });
//   });

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".sidenav");
  var instances = M.Sidenav.init(elems, {});
});

// Initialize collapsible (uncomment the lines below if you use the dropdown variation)
// var collapsibleElem = document.querySelector('.collapsible');
// var collapsibleInstance = M.Collapsible.init(collapsibleElem, options);

// Or with jQuery

$(document).ready(function () {
  $(".sidenav")
    .sidenav()
    .on("click tap", "li a", () => {
      $(".sidenav").sidenav("close");
      var cols = document.getElementsByClassName("sidenav-overlay");
    });
});

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".collapsible");
  var instances = M.Collapsible.init(elems, {});
});

// Or with jQuery

$(document).ready(function () {
  $(".collapsible").collapsible();
});

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".carousel");
  var instances = M.Carousel.init(elems, {});
});
