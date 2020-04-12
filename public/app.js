window.addEventListener('load', function() {
    //
});
////////////////////////////////////////////////////////////////////////////////////////
// BOARDS
$( ".column" ).sortable({
    connectWith: ".column",
    start: function (event, ui) {
        ui.item.addClass('tilt');
        tilt_direction(ui.item);
    },
    stop: function (event, ui) {
        ui.item.removeClass("tilt");
        $("html").unbind('mousemove', ui.item.data("move_handler"));
        ui.item.removeData("move_handler");
    }
});
$( ".row" ).sortable({
    connectWith: ".row",
    start: function (event, ui) {
        ui.item.addClass('tilt');
        tilt_direction(ui.item);
    },
    stop: function (event, ui) {
        ui.item.removeClass("tilt");
        $("html").unbind('mousemove', ui.item.data("move_handler"));
        ui.item.removeData("move_handler");
    }
});
function tilt_direction(item) {
    var left_pos = item.position().left,
        move_handler = function (e) {
            if (e.pageX >= left_pos) {
                item.addClass("right");
                item.removeClass("left");
            } else {
                item.addClass("left");
                item.removeClass("right");
            }
            left_pos = e.pageX;
        };
    $("html").bind("mousemove", move_handler);
    item.data("move_handler", move_handler);
}  
$( ".portlet" )
    .addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
$( ".column-portlet" )
    .addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
////////////////////////////////////////////////////////////////////////////////////////
// NAVBAR
var navbar = document.getElementById("myTopnav");
var sticky = navbar.offsetTop;
function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }
window.onscroll = function() {myFunction()};
function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
    }
}
////////////////////////////////////////////////////////////////////////////////////////
// NEW COLUMN POP UP
// pop up itself
var newcolmodal = document.getElementById("newcolmodal");
//button to open and close pop up
var close_newcolmodal = document.getElementsByClassName("close-newcolmodal")[0];
close_newcolmodal.onclick = function() {
    newcolmodal.style.display = "none";
}
// buttons to open pop up
$(".open-newcolmodal").on('click', function(event){
        newcolmodal.style.display = "block";
})

// When the user clicks anywhere outside of the popup, close it
window.onclick = function(event) {
    if (event.target == newcolmodal) {
        newcolmodal.style.display = "none";
    }
    else if (event.target == newtaskmodal) {
        newtaskmodal.style.display = "none";
    }

    else if (event.target == edittaskmodal) {
        edittaskmodal.style.display = "none";
    }
  }
////////////////////////////////////////////////////////////////////////////////////////
// NEW TASK POP UP
// pop up itself
var newtaskmodal = document.getElementById("newtaskmodal");
//button to open and close pop up
var close_newtaskmodal = document.getElementsByClassName("close-newtaskmodal")[0];
close_newtaskmodal.onclick = function() {
    newtaskmodal.style.display = "none";
}
// buttons to open pop up
$(".open-newtaskmodal").on('click', function(event){
    newtaskmodal.style.display = "block";
})
////////////////////////////////////////////////////////////////////////////////////////
//  EDIT TASK POP UP
// pop up itself
var edittaskmodal = document.getElementById("edittaskmodal");
//button to open and close pop up
var close_edittaskmodal = document.getElementsByClassName("close-edittaskmodal")[0];
close_edittaskmodal.onclick = function() {
    edittaskmodal.style.display = "none";
}
// buttons to open pop up
$(".open-edittaskmodal").on('click', function(event){
    edittaskmodal.style.display = "block";
})
