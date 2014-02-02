function add3DTransformable($transformable) {
    var handleSize = 20;

    var transformable_x = $transformable.position().left;
    var transformable_y = $transformable.position().top;
    var transformable_width = $transformable.outerWidth();
    var transformable_height = $transformable.outerHeight();
    
    $transformable.handles = []
    $transformable.originalBackground = $transformable.css("background");

    $transformable.css("-webkit-transform-origin", "0 0")
    $transformable.css("position", "fixed")

    $transformable.handle_top_left = $("<div class='handle top-left' style='width: " + handleSize + "; height: " + handleSize + "')/>")
    $transformable.handles.push($transformable.handle_top_left);
    $transformable.handle_top_left.css("-webkit-transform", "translate(" + (transformable_x - handleSize / 2) + "px, " + (transformable_y - handleSize / 2) + "px)");
    makeDragable($transformable.handle_top_left, $transformable)

    $transformable.handle_top_right = $("<div class='handle top-right' style='width: " + handleSize + "; height: " + handleSize + "')/>");
    $transformable.handles.push($transformable.handle_top_right)
    $transformable.handle_top_right.css("-webkit-transform", "translate(" + (transformable_x - handleSize / 2 + transformable_width) + "px, " + (transformable_y - handleSize / 2) + "px)");
    makeDragable($transformable.handle_top_right, $transformable)

    $transformable.handle_bottom_left = $("<div class='handle bottom-left' style='width: " + handleSize + "; height: " + handleSize + "')/>");
    $transformable.handles.push($transformable.handle_bottom_left);
    $transformable.handle_bottom_left.css("-webkit-transform", "translate(" + (transformable_x - handleSize / 2) + "px, " + (transformable_y - handleSize / 2 + transformable_height) + "px)");
    makeDragable($transformable.handle_bottom_left, $transformable)

    $transformable.handle_bottom_right = $("<div class='handle bottom-right' style='width: " + handleSize + "; height: " + handleSize + "')/>");
    $transformable.handles.push($transformable.handle_bottom_right)
    $transformable.handle_bottom_right.css("-webkit-transform", "translate(" + (transformable_x - handleSize / 2 + transformable_width) + "px, " + (transformable_y - handleSize / 2 + transformable_height) + "px)");
    makeDragable($transformable.handle_bottom_right, $transformable)

    for (var i = $transformable.handles.length - 1; i >= 0; i--) {
        $("body").append($transformable.handles[i])
    };

    makeTransformableDragable($transformable)


    enableKeyboardInteraction()
}

function enableKeyboardInteraction() {
    $("body").keydown(function(event){
        if (event.keyCode == 32) {
            var elements = [$(".handle")]

            for (var i = 0; i<elements.length; i++) {
                var element = elements[i];
                element.toggle();
            }
        } 
    });
}


function makeDragable($dragable, $transformable) {


    $dragable.mousedown(function() {
        $transformable.css("background", "green");
        $(window).mousemove(function(event) {
            $dragable.css("-webkit-transform", "translate(" + (event.pageX - $dragable.outerWidth() / 2) + "px, " + (event.pageY - $dragable.outerHeight() / 2) + "px)");
            update($transformable)
        });
    })
    .mouseup(function() {
        $(window).unbind("mousemove");
        $transformable.css("background", $transformable.originalBackground);
    });
}

function makeTransformableDragable($dragable) {


    $dragable.mousedown(function(dEvent) {
        var lastX = dEvent.pageX;
        var lastY = dEvent.pageY;
        $dragable.css("background", "green");

        $(window).mousemove(function(event) {
            var transX = event.pageX - lastX;
            var transY = event.pageY - lastY;

            for (var i = $dragable.handles.length - 1; i >= 0; i--) {
                var $handle = $dragable.handles[i];
                $handle.css("-webkit-transform", "translate(" + ($handle.offset().left + transX) + "px, " + ($handle.offset().top + transY) + "px)");
            };


            update($dragable)


            lastX = event.pageX;
            lastY = event.pageY;
        });

    })
    .mouseup(function() {
        $(window).unbind("mousemove");
        $dragable.css("background", $dragable.originalBackground);
    });
}


function update($transformable) {
    var box = $transformable

    transform2d(box[0], 
        box.handle_top_left.position().left + box.handle_top_left.width()/2, 
        box.handle_top_left.position().top + box.handle_top_left.height()/2,
        box.handle_top_right.position().left + box.handle_top_right.width()/2, 
        box.handle_top_right.position().top + box.handle_top_right.height()/2,
        box.handle_bottom_left.position().left + box.handle_bottom_left.width()/2, 
        box.handle_bottom_left.position().top + box.handle_bottom_left.height()/2,
        box.handle_bottom_right.position().left + box.handle_bottom_right.width()/2, 
        box.handle_bottom_right.position().top + box.handle_bottom_right.height()/2
    );
}


function adj(m) { // Compute the adjugate of m
    return [
        m[4] * m[8] - m[5] * m[7], m[2] * m[7] - m[1] * m[8], m[1] * m[5] - m[2] * m[4],
        m[5] * m[6] - m[3] * m[8], m[0] * m[8] - m[2] * m[6], m[2] * m[3] - m[0] * m[5],
        m[3] * m[7] - m[4] * m[6], m[1] * m[6] - m[0] * m[7], m[0] * m[4] - m[1] * m[3]
    ];
}


function multmm(a, b) { // multiply two matrices
    var c = Array(9);
    for (var i = 0; i != 3; ++i) {
        for (var j = 0; j != 3; ++j) {
            var cij = 0;
            for (var k = 0; k != 3; ++k) {
                cij += a[3 * i + k] * b[3 * k + j];
            }
            c[3 * i + j] = cij;
        }
    }
    return c;
}

function multmv(m, v) { // multiply matrix and vector
    return [
        m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
        m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
        m[6] * v[0] + m[7] * v[1] + m[8] * v[2]
    ];
}

function pdbg(m, v) {
    var r = multmv(m, v);
    return r + " (" + r[0] / r[2] + ", " + r[1] / r[2] + ")";
}

function basisToPoints(x1, y1, x2, y2, x3, y3, x4, y4) {
    var m = [
        x1, x2, x3,
        y1, y2, y3,
        1, 1, 1
    ];
    var v = multmv(adj(m), [x4, y4, 1]);
    return multmm(m, [
        v[0], 0, 0,
        0, v[1], 0,
        0, 0, v[2]
    ]);
}

function general2DProjection(
    x1s, y1s, x1d, y1d,
    x2s, y2s, x2d, y2d,
    x3s, y3s, x3d, y3d,
    x4s, y4s, x4d, y4d
) {
    var s = basisToPoints(x1s, y1s, x2s, y2s, x3s, y3s, x4s, y4s);
    var d = basisToPoints(x1d, y1d, x2d, y2d, x3d, y3d, x4d, y4d);
    return multmm(d, adj(s));
}

function project(m, x, y) {
    var v = multmv(m, [x, y, 1]);
    return [v[0] / v[2], v[1] / v[2]];
}

function transform2d(elt, x1, y1, x2, y2, x3, y3, x4, y4) {
    var w = elt.offsetWidth,
        h = elt.offsetHeight;
    var t = general2DProjection(0, 0, x1, y1, w, 0, x2, y2, 0, h, x3, y3, w, h, x4, y4);
    for (i = 0; i != 9; ++i) t[i] = t[i] / t[8];
    t = [t[0], t[3], 0, t[6],
        t[1], t[4], 0, t[7],
        0, 0, 1, 0,
        t[2], t[5], 0, t[8]
    ];
    t = "matrix3d(" + t.join(", ") + ")";
    elt.style["-webkit-transform"] = t;
    elt.style["-moz-transform"] = t;
    elt.style["-o-transform"] = t;
    elt.style.transform = t;
}