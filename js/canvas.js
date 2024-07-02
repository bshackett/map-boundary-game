"use strict";

import { coordinatesListsDegreesToRadians, scaleCoordinates, invertY, scrollHorizontallyToFindMinMapWidth, centre } from "./border-data/common.js";
import { albersEqualAreaConicProjection } from "./projections/albers-equal-area-conic.js";
import { webMercatorProjection } from "./projections/mercator.js";

function drawCircle(ctx, centre_x, centre_y, radius){
    ctx.strokeStyle = 'rgb(255 255 255)';
    ctx.beginPath();
    ctx.arc(centre_x, centre_y, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawPath(ctx, scaled_coordinates){
    ctx.beginPath();
    let initial_coordinate = scaled_coordinates[0];
    // TODO - fix 600 hardcoding.
    ctx.moveTo(initial_coordinate[0], initial_coordinate[1]);
    for (let i=1; i < scaled_coordinates.length; i++) {
        let coordinates = scaled_coordinates[i];
        let x = coordinates[0];
        let y = coordinates[1];
        ctx.lineTo(x, y);
    }
    ctx.stroke();
}

function drawBoundaries(ctx, scaled_coordinates_lists, strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    for (const scaled_coordinates of scaled_coordinates_lists) {
        drawPath(ctx, scaled_coordinates);
    }
}

function projectionToRGB(projection) {
    if (projection == "Equirectangular") {
        return [255, 0, 0];
    } else if (projection == "Albers Equal Area Conic") {
        return [0, 255, 0];
    } else if (projection == "Web Mercator") {
        return [0, 0, 255];
    }
    return null;
}

function projectionToStrokeStyle(projection) {
    let [r, g, b] = projectionToRGB(projection);
    return `rgb(${r} ${g} ${b} )`;
}

function drawAnswer(ctx, region, coordinates_lists, projection) {
    if (region == "Russian Federation" || region == "United States of America") {
        // Must happen before projections, otherwise you risk ending up with a tiny map.
        coordinates_lists = scrollHorizontallyToFindMinMapWidth(coordinates_lists);
    }

    coordinates_lists = coordinatesListsDegreesToRadians(coordinates_lists);

    if (projection == "Equirectangular") {
        coordinates_lists = invertY(coordinates_lists);
    } else if (projection == "Albers Equal Area Conic") {
        coordinates_lists = albersEqualAreaConicProjection(coordinates_lists);
        coordinates_lists = invertY(coordinates_lists);
    } else if (projection == "Web Mercator") {
        coordinates_lists = webMercatorProjection(coordinates_lists, 9);
    } else {
        console.log("Error: unexpected projection: " + projection);
        return;
    }

    coordinates_lists = scaleCoordinates(coordinates_lists, 500, 500);
    coordinates_lists = centre(coordinates_lists, 600, 600);
    let strokeStyle = projectionToStrokeStyle(projection);

    drawBoundaries(ctx, coordinates_lists, strokeStyle);
}

function resetCanvas() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

// new position from mouse event
function setMousePosition(e) {
    mouse_pos.x = e.clientX - canvas_bounding_rect.left;
    mouse_pos.y = e.clientY - canvas_bounding_rect.top;
}

function mouseDraw(e) {
    // mouse left button must be pressed
    if (e.buttons !== 1) return;

    ctx.beginPath();
    ctx.strokeStyle = 'rgb(255 255 255)';

    ctx.moveTo(mouse_pos.x, mouse_pos.y); // from
    setMousePosition(e);
    ctx.lineTo(mouse_pos.x, mouse_pos.y); // to

    ctx.stroke();
}

export { drawCircle, projectionToRGB, drawAnswer, resetCanvas, setMousePosition, mouseDraw };

