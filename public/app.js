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
// POP UP
var modal = document.getElementById("modal");
var close_modal = document.getElementsByClassName("close-modal")[0];

var last_call_from;


close_modal.onclick = function() {
    modal.style.display = "none";
}
// buttons to open pop up
$(".open-modal").on('click', function(event){
    var modal_type = $(this).text();
    var title;
    var submit;
    last_call_from = $(this).parent().attr("id");
    if(modal_type === "New"){
        submit = "Create";

        if($(this).parent().hasClass("row")){
            title = "Create new Column";
        } 
        else if($(this).parent().hasClass("column-portlet")){
            title = "Create new Task";
        } 
    }

    else if(modal_type === "Edit"){
            
        submit = "Save";

        if($(this).parent().hasClass("portlet")){
            title = "Edit Task";
        } 
        else if($(this).parent().hasClass("column-portlet")){
            title = "Edit Column";
        }
    }



    $(".modal").find(".modal-content").find(".modal-header").find("h2").text(title);
    $(".modal").find(".modal-content").find(".modal-body").html('<label for="name">Name:</label><input type="text" id="name" name="name"><br><br><label for="desc">Description:</label><input type="text" id="desc" name="desc"><br><br>');
    $(".modal").find(".modal-content").find(".modal-footer").find("button").text(submit);
    modal.style.display = "block";
})

$(".submit-modal").on('click', function(event){
    modal.style.display = "none";
})

// When the user clicks anywhere outside of the popup, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
  }