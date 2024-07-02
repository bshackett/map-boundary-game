"use strict";

import { getMinMax } from "../border-data/common.js";

// https://en.wikipedia.org/wiki/Albers_projection
// https://surferhelp.goldensoftware.com/projections/Albers_Equal_Area_Conic_Projection.htm

export function albersEqualAreaConicProjection(coordinates_lists) {
    let {min_x, max_x, min_y, max_y} = getMinMax(coordinates_lists);
    let standard_parallel_1 = min_y;
    let standard_parallel_2 = max_y;
    let reference_latitude = (min_y + max_y) / 2;
    let reference_longitude = (min_x + max_x) / 2;
    let n = (Math.sin(standard_parallel_1) + Math.sin(standard_parallel_2)) / 2;
    let C = (Math.cos(standard_parallel_1) ** 2) + (2 * n * Math.sin(standard_parallel_1));
    let rho_0 = Math.sqrt((C - (2 * n * Math.sin(reference_latitude)))) / n;
    let projected_coordinates_lists = [];
    for (const coordinates_list of coordinates_lists) {
        let projected_coordinates_list = [];
        for (const coordinates of coordinates_list) {
            let longitude = coordinates[0];
            let latitude = coordinates[1];
            let theta = n * (longitude - reference_longitude);
            let rho = Math.sqrt((C - (2 * n * Math.sin(latitude)))) / n;
            let x = rho * Math.sin(theta);
            let y = rho_0 - (rho * Math.cos(theta));
            projected_coordinates_list.push([x,y]);
        }
        projected_coordinates_lists.push(projected_coordinates_list);
    }
    return projected_coordinates_lists;
}


