/*

    Keyboard mapping

 */

function keyboard(dispatch) {
    KeyboardJS.on('shift', function () {
        dispatch.fire('+mod1');
    }, function () {
        dispatch.fire('-mod1');
    });

    KeyboardJS.on('space', function () {
        dispatch.fire('+mod2');
    }, function () {
        dispatch.fire('-mod2');
    });

    KeyboardJS.on('a', function () {
        dispatch.fire('+left');
    }, function () {
        dispatch.fire('-left');
    });

    KeyboardJS.on('d', function () {
        dispatch.fire('+right');
    }, function () {
        dispatch.fire('-right');
    });

    KeyboardJS.on('w', function () {
        dispatch.fire('+up');
    }, function () {
        dispatch.fire('-up');
    });

    KeyboardJS.on('s', function () {
        dispatch.fire('+down');
    }, function () {
        dispatch.fire('-down');
    });
}