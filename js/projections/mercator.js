"use strict";

// https://stackoverflow.com/questions/14329691/convert-latitude-longitude-point-to-a-pixels-x-y-on-mercator-projection
// https://en.wikipedia.org/wiki/Web_Mercator_projection

export function webMercatorProjection(coordinates_lists, zoom_level) {
    let new_coordinates_lists = [];
    for (const coordinates_list of coordinates_lists) {
        let new_coordinates_list = [];
        for (const coordinates of coordinates_list) {
            let longitude_radians = coordinates[0];
            let latitude_radians = coordinates[1];
            let x = (1/(2*Math.PI)) * (2**zoom_level) * (longitude_radians + Math.PI);
            let log_calculation = Math.log(Math.tan((Math.PI/4) + (latitude_radians/2)));
            let y = (1/(2*Math.PI)) * (2**zoom_level) * (Math.PI - log_calculation);
            new_coordinates_list.push([x, y]);
        }
        new_coordinates_lists.push(new_coordinates_list);
    }
    return new_coordinates_lists;
}


