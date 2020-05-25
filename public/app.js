// BOARDS
$('.column').sortable({
    connectWith: '.column',
    start: function (event, ui) {
        ui.item.addClass('tilt');
        tilt_direction(ui.item);
    },
    stop: function (event, ui) {
        postRequest(
            '/api/tasks/reorder',
            Array.from($('.column')).map((column) => {
                const tasks = $(column)
                    .sortable('toArray', { attribute: 'data-task-id' })
                    .filter(Boolean)
                    .map((x, i) => ({ id: parseInt(x), ordering: i + 1 }));

                return { tasks, column_id: parseInt($(column).attr('data-column-id')) };
            }),
        );

        ui.item.removeClass('tilt');
        $('html').unbind('mousemove', ui.item.data('move_handler'));
        ui.item.removeData('move_handler');
    },
});
$('.row').sortable({
    connectWith: '.row',
    start: function (event, ui) {
        ui.item.addClass('tilt');
        tilt_direction(ui.item);
    },
    stop: function (event, ui) {
        postRequest(
            '/api/columns/reorder',
            $(this)
                .sortable('toArray', { attribute: 'data-column-id' })
                .filter(Boolean)
                .map((id, i) => ({ id: parseInt(id), ordering: i })),
        );

        ui.item.removeClass('tilt');
        $('html').unbind('mousemove', ui.item.data('move_handler'));
        ui.item.removeData('move_handler');
    },
});
function isDark( color ) {
    var match = /rgb\((\d+).*?(\d+).*?(\d+)\)/.exec(color);
    return parseFloat(match[1])
         + parseFloat(match[2])
         + parseFloat(match[3])
           < 3 * 256 / 2; // r+g+b should be less than half of max (3 * 256)
}
function disable_board(){
    $(".row").sortable( "disable" );
    $(".column").sortable( "disable" );
}
function enable_board(){

    $(".row").sortable( "enable" );
    $(".column").sortable( "enable" );
}
function tilt_direction(item) {
    var left_pos = item.position().left,
        move_handler = function (e) {
            if (e.pageX >= left_pos) {
                item.addClass('right');
                item.removeClass('left');
            } else {
                item.addClass('left');
                item.removeClass('right');
            }
            left_pos = e.pageX;
        };
    $('html').bind('mousemove', move_handler);
    item.data('move_handler', move_handler);
}
$('.portlet').addClass('ui-widget ui-widget-content ui-helper-clearfix ui-corner-all');
$('.column-portlet').addClass('ui-widget ui-widget-content ui-helper-clearfix ui-corner-all');
////////////////////////////////////////////////////////////////////////////////////////
// NAVBAR
var navbar = document.getElementById('myTopnav');
function responsive() {
    var x = document.getElementById('myTopnav');
    if (x.className === 'topnav') {
        x.className += ' responsive';
    } else {
        x.className = 'topnav';
    }
}
window.onscroll = function () {
    if (window.pageYOffset > 0) {
        navbar.classList.add('sticky');
    } else {
        navbar.classList.remove('sticky');
    }
};
////////////////////////////////////////////////////////////////////////////////////////
// POP UP

$('.modal-wrapper .open-modal').on('click', function () {
    disable_board();
    $('.modal', $(this).parent('.modal-wrapper')).show();
});
$('.modal-wrapper .close-modal').on('click', function () {
    enable_board();
    $(this).closest('.modal').hide();
});

$('[data-delete]').on('click', function () {
    if (confirm('Are you sure?')) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = $(this).attr('data-delete');
        document.body.appendChild(form);
        form.submit();
    }
});

function postRequest(url, payload) {
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
}
