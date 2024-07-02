"use strict";

import { drawCircle, projectionToRGB, drawAnswer, resetCanvas, setMousePosition, mouseDraw } from "./canvas.js";
import { getBoundary, getCoordinates } from "./border-data/world-administrative-boundaries/import.js";
import { getBoundaries } from "./border-data/world-administrative-boundaries/world-administrative-boundaries.js";
import { getBoolMatrix, sumNearestDistances, numericScoreToLetterGrade } from "./grading/common.js";

export function onLoad() {
    const canvas = document.getElementById("borders-canvas");
    const ctx = canvas.getContext("2d");
    // If lineWidth is 1, no data points are the exact color of the strokeStyle :/.
    // So lineWidth must be AT LEAST 2.
    ctx.lineWidth = 2;
    globalThis.ctx = ctx;
    globalThis.canvas_bounding_rect = canvas.getBoundingClientRect();
    const region_selector = document.getElementById("region-selector");
    const projection_selector = document.getElementById("projection-selector");
    const grade_div = document.getElementById("grade");
    let boundaries = getBoundaries();
    let region_names = boundaries.map(boundary => boundary["name"]);
    region_names.sort();
    for (const region_name of region_names) {
        let option = document.createElement("option");
        option.text = region_name;
        option.value = region_name;
        region_selector.appendChild(option);
    }
    let human_answer = null;
    let actual_answer = null;
    const answer_button = document.getElementById("answer-button");
    function showAnswer() {
        let region_name = region_selector.value;
        human_answer = getBoolMatrix(ctx, 255, 255, 255, 255);
        let projection = projection_selector.value;
        let actual_answer_rgb = projectionToRGB(projection);
        let boundary = getBoundary(boundaries, region_name);
        let coordinates_lists = getCoordinates(boundary);
        drawAnswer(ctx, region_name, coordinates_lists, projection);
        actual_answer = getBoolMatrix(
            ctx,
            actual_answer_rgb[0],
            actual_answer_rgb[1],
            actual_answer_rgb[2],
            255
        );
    }
    answer_button.addEventListener("click", (event) => {
        showAnswer();
    });
    const grade_button = document.getElementById("grade-button");
    grade_button.addEventListener("click", (event) => {
        showAnswer();
        let distance_sum = sumNearestDistances(human_answer, actual_answer);
        distance_sum += sumNearestDistances(actual_answer, human_answer);
        let letter_grade = numericScoreToLetterGrade(distance_sum);
        grade_div.innerText = "Your grade: " + letter_grade;
    });

    const clear_button = document.getElementById("clear-button");
    clear_button.addEventListener("click", (event) => {
        resetCanvas();
        grade_div.innerText = "";
    });

    const circle_button = document.getElementById("one-circle-button");
    if (circle_button) {
        circle_button.addEventListener("click", (event) => {
            drawCircle(ctx, 300, 300, 150);
        });
    }

    const many_circles_button = document.getElementById("twenty-circles-button");
    if (many_circles_button) {
        many_circles_button.addEventListener("click", (event) => {
            for (let i=0; i<20; i++) {
                drawCircle(ctx, 300, 300, (i+1)*15);
            }
        });
    }


    // last known position
    globalThis.mouse_pos = { x: 0, y: 0 };

    document.addEventListener('mousemove', mouseDraw);
    document.addEventListener('mousedown', setMousePosition);
    document.addEventListener('mouseenter', setMousePosition);

    resetCanvas();
}

window.addEventListener('load', onLoad);

