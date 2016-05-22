/// <reference path="bounds.ts"/>
/// <reference path="coords.ts"/>
/// <reference path="shape.ts"/>
/// <reference path="circle.ts"/>
/// <reference path="polygon.ts"/>
/// <reference path="draw.ts"/>

//table setup
var table = document.getElementById("table") as HTMLTableElement;
var nextIndex = 0;

//canvas setup
var canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.addEventListener('mousemove', SetMousePosition, false);
canvas.addEventListener('mousedown', SaveIntersection, false);

//canvas vars
var ctx = canvas.getContext("2d");
var mouse: Coord = new Coord(0, 0);

//center of the screen
var center: Offset = new Offset(0, 0);

//no idea what it is, but it looks important
var scaler = 0.48;

//width or height of the canvas, which one is bigger
var maxSize:number;
//should save a nano second here and there
var halfWidth:number, halfHeight:number;

//settings
var horizontalIntersect = true;
var enableMouseLine = false;
var hideIntersections = false;
var closePolygon = false;

Rebuild();

//update 50 times per second
var updateInt = setInterval(Update, 20);

//Input vars
var polygonSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById('add-polygon');
var selectedTab;
var inputType:string;
SetInputType(document.getElementById('input-type-select').children[0]);

var inputX: HTMLInputElement = <HTMLInputElement>document.getElementById('inputX');
var inputY: HTMLInputElement = <HTMLInputElement>document.getElementById('inputY');

//Object holders
var polygonArray: Polygon[] = [];
var pointArray: Point[] = [];

//OFTEN CALLED MAIN FUNCTIONS
function Update() {
    var rcnt = RecountUpdate();
    DrawUpdate(rcnt.scale, rcnt.offset);
};

//Prepared for future optimalizations
function RecountUpdate() {
    var bounds = Bounds.GetEmpty();
    for (var i = 0; i < polygonArray.length; i++)
        var pBounds = polygonArray[i].bounds;

    var maxDist = Math.abs(bounds.maX);
    maxDist = ReturnAbsBigger(maxDist, bounds.maY);
    maxDist = ReturnAbsBigger(maxDist, bounds.miX);
    maxDist = ReturnAbsBigger(maxDist, bounds.miY);
    return {
        scale: maxSize / maxDist,
        offset: new Offset((bounds.maX + bounds.miX) / 2, (bounds.maY + bounds.miY) / 2)
    };
}

//Prepared for future optimalizations
function DrawUpdate(scale: number, offset: Offset) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#000000";
    //DrawCross();
    for (var i = 0; i < polygonArray.length; i++)
        polygonArray[i].Draw(ctx, scale, center);
}

/*function DrawIntersections(array) {
    for (var i = 0; i < savedILines.length; i++)
        DrawIntersection(savedILines[i], array, true);

    if (enableMouseLine)
        DrawIntersection(GetMouseLine(), array, false);
}*/


//OFTEN CALLED SUPPORT FUNCTIONS
function ScaleToOriginal(scale: number, pos: Coord, offset: Offset) {
    var halfScale = scale * scaler;
    return {
        x: ((pos.x - offset.h) / halfScale),
        y: -((pos.y - offset.v) / halfScale)
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
        //result.draw = ScaleToDraw(result);
    }

    return result;
}

function GetMouseLine() {
    /*if (horizontalIntersect)
        return {
            start: ScaleToOriginal({ x: halfWidth - halfMaxSize, y: mouse.y }),
            end: ScaleToOriginal({ x: halfWidth + halfMaxSize, y: mouse.y })
        };
    else
        return {
            start: ScaleToOriginal({ x: mouse.x, y: halfHeight - halfMaxSize }),
            end: ScaleToOriginal({ x: mouse.x, y: halfHeight + halfMaxSize })
        };*/
}

function IsMouseInRange(pos, radius) {
    var distanceVector = {
        x: Math.abs(mouse.x - pos.draw.x),
        y: Math.abs(mouse.y - pos.draw.y)
    };
    var distanceSqrd = distanceVector.x * distanceVector.x + distanceVector.y * distanceVector.y;
    return distanceSqrd < radius * radius;
}

//EVENTUALLY CALLED FUNCTIONS
function Rebuild() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    halfWidth = canvas.width / 2;
    halfHeight = canvas.height / 2;
    maxSize = canvas.width > canvas.height ? canvas.height : canvas.width;
}


//EVENT FUNCTIONS
function SetMousePosition(event) {
    mouse.x = event.pageX;
    mouse.y = event.pageY;
};

function SaveIntersection() {
    //if (enableMouseLine)
    //savedILines.push(GetMouseLine());
}

function ClearAll() {
    //savedILines = [];
}

function SetInputType(elem:Element) {
    inputType = elem.innerHTML.toLowerCase();
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

function IsValid(inputField: HTMLInputElement) {
    if (inputField.value.trim() == "") {
        inputField.className += ' invalid';
        return false;
    } else {
        inputField.className = inputX.className.replace(' invalid', '');
        return true;
    }
};

function GenerateOption(name) {
    var option = document.createElement("option");
    option.text = name;
    return option;
};

function AddPoint() {
    if (!(IsValid(<HTMLInputElement>inputX) && IsValid(<HTMLInputElement>inputY)))
        return;

    if (polygonSelect.selectedIndex == 0) {
        var row = table.insertRow();
        var cell = row.insertCell(0);
        cell.colSpan = 4;
        cell.innerText = "polygon " + polygonArray.length;
        polygonArray.push(new Polygon(ctx, row));

        polygonSelect.add(GenerateOption("Polygon " + polygonArray.length));
        polygonSelect.selectedIndex = polygonArray.length + 1;
    }

    if (polygonSelect.selectedIndex == 1) {
        var row = table.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);

        cell2.innerHTML = "<input type='text' onkeypress='return CheckKey(event)' value='" + inputX.value + "'>";
        cell3.innerHTML = "<input type='text' onkeypress='return CheckKey(event)' value='" + inputY.value + "'>";
        cell4.innerHTML = "<button class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored' onclick='RemovePoint(" + nextIndex + ")'><img src='icons/remove.svg' width='24px'></button>";

        pointArray.push(new Point(ctx, row, +inputX.value, +inputY.value));
    }
    else {
        var polygon = polygonArray[polygonSelect.selectedIndex - 2];
        var row = table.insertRow();

        //insert cells
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        //fill cells
        cell1.innerHTML = "<img src='icons/" + inputType + ".svg' width='24'>";
        cell1.className = 'cellCollapsed';
        cell2.innerHTML = "<input type='text' onkeypress='return CheckKey(event)' value='" + inputX.value + "'>";
        cell3.innerHTML = "<input type='text' onkeypress='return CheckKey(event)' value='" + inputY.value + "'>";
        cell4.innerHTML = "<button class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored' onclick='RemovePoint(" + nextIndex + ")'><img src='icons/remove.svg' width='24px'></button>";

        polygon.AddPoint(+inputX.value, +inputY.value, inputType == "vector");
    }

    inputX.value = "";
    inputY.value = "";
}

//initialization
polygonSelect.add(GenerateOption("Add new"));
polygonSelect.add(GenerateOption("Point"));