"use strict";
//table setup
var table = document.getElementById("table");
var nextIndex = 0;

//canvas setup
var canvas = document.getElementById("canvas");
canvas.addEventListener('mousemove', SetMousePosition, false);
canvas.addEventListener('mousedown', SaveIntersection, false);

Rebuild();

//canvas vars
var ctx = canvas.getContext("2d");
var mouse = {};
var scale, maxSize, halfMaxSize, halfWidth, halfHeight, min, max;
var center = { x: 0, y: 0 };
var horizontalIntersect = true;
var enableMouseLine = true;
var hideIntersections = false;
var closePolygon = false;
var scaler = 0.48;

var points = [];
var savedILines = [];

//set for 50fps
var updateInt = setInterval(Update, 20);

//Input vars
var polygonSelect = document.getElementById('add-polygon');
var selectedTab;
var inputType;
SetInputType(document.getElementById('input-type-select').children[0]);

var inputX = document.getElementById('inputX');
var inputY = document.getElementById('inputY');

//polygons
var polygonArray = []

class Polygon {
  constructor(index) {
      this.index = index;
      this.points = [];
  }
  
  AddPoint(point) {
      this.points.push(point);
  }
  
  AddPoint(x,y) {
      this.points.push({"x":x,"y":y});
  }
  
  get points() {
      return this.points;
  }
}

function GenerateOption(name) {
    var option = document.createElement("option");
    option.text = name;
    return option;
}

//OFTEN CALLED MAIN FUNCTIONS
function Update() {
    //Loads first row to min and max data
    if (table.rows.length > 1) {
        var firstRow = ParseData(table.rows[1]);
        min = { x: firstRow.pos.x, y: firstRow.pos.y };
        max = { x: firstRow.pos.x, y: firstRow.pos.y };
    }
    else
        return;

    //Canvas and var preparation
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#000000";
    var array = [];
    for (var i = 1; i < table.rows.length; i++) {
        //load info from table
        var data = ParseData(table.rows[i]);

        //Special type actions
        switch (data.type) {
            case "vector":
                //If the vector is first point, add 0,0 point
                if (i == 1)
                    array.push({ x: 0, y: 0 });
                    
                //Add position from previous element (Converting vector to point internally)
                data.pos.x += array[array.length - 1].x;
                data.pos.y += array[array.length - 1].y;
                break;
        }

        //check if its the highest or lowest yet
        if (data.pos.x > max.x) max.x = data.pos.x;
        else if (data.pos.x < min.x) min.x = data.pos.x;

        if (data.pos.y > max.y) max.y = data.pos.y;
        else if (data.pos.y < min.y) min.y = data.pos.y;

        //insert item to array
        array.push(data.pos);
    }

    //find the biggest value for scaling purpose
    var maxDist = Math.abs(max.x);
    maxDist = ReturnAbsBigger(maxDist, max.y);
    maxDist = ReturnAbsBigger(maxDist, min.x);
    maxDist = ReturnAbsBigger(maxDist, min.y);

    scale = maxSize / maxDist;
    center = { x: (max.x + min.x) / 2, y: (max.y + min.y) / 2 };

    DrawCross();
    if (array.length > 1) {
        if (closePolygon) array.push(array[0]);
        DrawLines(array);

        if (!hideIntersections)
            DrawIntersections(array);
    }
};

//Prepared for future optimalizations
function RecountUpdate() {

}

//Prepared for future optimalizations
function DrawUpdate() {

}

function DrawIntersections(array) {
    for (var i = 0; i < savedILines.length; i++)
        DrawIntersection(savedILines[i], array, true);

    if (enableMouseLine)
        DrawIntersection(GetMouseLine(), array, false);
}



//OFTEN CALLED SUPPORT FUNCTIONS
function ParseData(row) {
    return {
        type: row.cells[0].dataset.type,
        pos: {
            x: parseFloat(row.cells[1].children[0].value),
            y: parseFloat(row.cells[2].children[0].value)
        }
    }
}

function ScaleToDraw(position) {
    var halfScale = scale * scaler;
    return {
        x: (position.x) * halfScale + halfWidth,
        y: -(position.y) * halfScale + halfHeight
    }
}

function ScaleToOriginal(pos) {
    var halfScale = scale * scaler;
    return {
        x: ((pos.x - halfWidth) / halfScale),
        y: -((pos.y - halfHeight) / halfScale)
    };
}

function ReturnAbsBigger(currentVal, newVal) {
    var absCur = Math.abs(currentVal);
    var absNew = Math.abs(newVal);
    return absNew > absCur ? absNew : absCur;
}

function CheckLineIntersection(line1, line2) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        intersects: false
    };
    denominator = ((line2.end.y - line2.start.y) * (line1.end.x - line1.start.x)) - ((line2.end.x - line2.start.x) * (line1.end.y - line1.start.y));

    if (denominator == 0)
        return result;

    a = line1.start.y - line2.start.y;
    b = line1.start.x - line2.start.x;
    numerator1 = ((line2.end.x - line2.start.x) * a) - ((line2.end.y - line2.start.y) * b);
    numerator2 = ((line1.end.x - line1.start.x) * a) - ((line1.end.y - line1.start.y) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    if (b > 0 && b < 1 && a > 0 && a < 1) {
        result.intersects = true;
        result.x = line1.start.x + (a * (line1.end.x - line1.start.x));
        result.y = line1.start.y + (a * (line1.end.y - line1.start.y));
        result.draw = ScaleToDraw(result);
    }

    return result;
}

function GetMouseLine() {
    if (horizontalIntersect)
        return {
            start: ScaleToOriginal({ x: halfWidth - halfMaxSize, y: mouse.y }),
            end: ScaleToOriginal({ x: halfWidth + halfMaxSize, y: mouse.y })
        };
    else
        return {
            start: ScaleToOriginal({ x: mouse.x, y: halfHeight - halfMaxSize }),
            end: ScaleToOriginal({ x: mouse.x, y: halfHeight + halfMaxSize })
        };
}

function IsMouseInRange(pos, radius) {
    var distanceVector = {
        x: Math.abs(mouse.x - pos.draw.x),
        y: Math.abs(mouse.y - pos.draw.y)
    };
    var distanceSqrd = distanceVector.x * distanceVector.x + distanceVector.y * distanceVector.y;
    return distanceSqrd < radius * radius;
}



//CANVAS FUNCTIONS
function DrawLines(array) {
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    for (var i = 0; i < array.length - 1; i++) {
        //console.log("from (" + array[i].x + ", " + array[i].y + ") to (" + array[i+1].x + ", " + array[i+1].y + ")");
        ctx.beginPath();
        var pos = ScaleToDraw(array[i]);
        console.log(pos);
        console.log(array[i]);
        ctx.moveTo(pos.x, pos.y);

        pos = ScaleToDraw(array[i + 1]);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    }
}

function DrawIntersection(iLine, array, enableMouseInteraction) {
    var intersections = [];
    //Go through every item in array and check if it intersects with mouse line
    for (var i = 0; i < array.length - 1; i++) {
        var line = {
            start: array[i],
            end: array[i + 1]
        }

        var result = CheckLineIntersection(iLine, line);

        if (result.intersects)
            intersections.push(result);
    }
    //draws base line for the intersections
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.setLineDash([10]);

    var startScaled = ScaleToDraw(iLine.start);
    ctx.moveTo(startScaled.x, startScaled.y);

    var endScaled = ScaleToDraw(iLine.end);
    ctx.lineTo(endScaled.x, endScaled.y);

    ctx.closePath();
    ctx.strokeStyle = '#9297B5';
    ctx.stroke();
    ctx.setLineDash([0]);
    //draw every intersection point found
    for (var i = 0; i < intersections.length; i++) {
        if (enableMouseInteraction)
            var mouseInRange = IsMouseInRange(intersections[i], 10);

        var radius = mouseInRange ? 10 : 5;
        if (mouseInRange) DrawCoords(intersections[i]);
        ctx.beginPath();
        ctx.arc(intersections[i].draw.x, intersections[i].draw.y, radius, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = '#3F51B5';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}

function DrawCoords(pos) {
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = '#757575';
    DrawRoundedRect(pos.draw.x - 30, pos.draw.y + 15, 60, 30, 7, true, false);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';

    ctx.font = "500 11px Roboto";

    ctx.textAlign = 'center';
    ctx.fillText("x: " + pos.x.toFixed(2), pos.draw.x, pos.draw.y + 27);
    ctx.fillText("y: " + pos.y.toFixed(2), pos.draw.x, pos.draw.y + 40);
};

function DrawRoundedRect(x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "undefined") {
        radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke) {
        ctx.stroke();
    }
    if (fill) {
        ctx.fill();
    }
}

function DrawCross() {
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(halfWidth, halfHeight - halfMaxSize);
    ctx.lineTo(halfWidth, halfHeight + halfMaxSize);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(halfWidth - halfMaxSize, halfHeight);
    ctx.lineTo(halfWidth + halfMaxSize, halfHeight);
    ctx.stroke();
    ctx.closePath();
};

function DrawPoint(pos) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#757575';
    DrawRoundedRect(pos.draw.x - 30, pos.draw.y + 15, 60, 30, 7, true, false);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
}


//EVENTUALLY CALLED FUNCTIONS
function Rebuild() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    halfWidth = canvas.width / 2;
    halfHeight = canvas.height / 2;
    maxSize = canvas.width > canvas.height ? canvas.height : canvas.width;
    halfMaxSize = maxSize / 2;
}


//EVENT FUNCTIONS
function SetMousePosition(event) {
    mouse.x = event.pageX;
    mouse.y = event.pageY;
};

function SaveIntersection() {
    if (enableMouseLine)
        savedILines.push(GetMouseLine());
}

function ClearAll() {
    savedILines = [];
}

function SetInputType(elem) {
    inputType = elem.innerHTML;
    if (selectedTab != null)
        selectedTab.className = selectedTab.className.replace(' is-active', '').trim();

    selectedTab = elem;
    elem.className += ' is-active';
}

function CheckKey(event) {
    var key = event.keyCode || event.charCode;
    //allowed keys are 1-9, backspace, delete and -
    return (key >= 48 && key <= 57) || key == 8 || key == 46 || key == 45;
};

function IsValid(inputField) {
    if (inputField.value.trim() == "") {
        inputField.className += ' invalid';
        return false;
    } else {
        inputField.className = inputX.className.replace(' invalid', '');
        return true;
    }
}

function AddPoint() {
    var valid = IsValid(inputX);
    valid &= IsValid(inputY);
    if (!valid)
        return;

    var row = table.insertRow();
    row.dataset.id = ++nextIndex;

    //insert cells
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    //fill cells
    cell1.innerHTML = "<img src='icons/" + inputType + ".svg' width='24'>";
    cell1.className = 'cellCollapsed';
    cell1.dataset.type = inputType;
    cell2.innerHTML = "<input type='text' onkeypress='return CheckKey(event)' value='" + inputX.value + "'>";
    cell3.innerHTML = "<input type='text' onkeypress='return CheckKey(event)' value='" + inputY.value + "'>";
    cell4.innerHTML = "<button class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored' onclick='RemovePoint(" + nextIndex + ")'><img src='icons/remove.svg' width='24px'></button>";

    inputX.value = "";
    inputY.value = "";
}

function RemovePoint(index) {
    for (var i = 0; i < table.rows.length; i++) {
        if (table.rows[i].dataset.id == index) {
            table.deleteRow(i);
            break;
        }
    }
}

//initialization
polygonSelect.add(GenerateOption("Add new"));
polygonSelect.add(GenerateOption("Point"));