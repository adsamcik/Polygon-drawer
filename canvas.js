   var table = document.getElementById("table");
   var nextIndex = 0;

   //canvas setup
   var canvas = document.getElementById("canvas");
   canvas.addEventListener('mousemove', SetMousePosition, false);
   canvas.addEventListener('mousedown', SaveIntersection, false);

   Rebuild();
   var ctx = canvas.getContext("2d");

   var mouse = {};
   var scale, maxSize, halfMaxSize, halfWidth, halfHeight;
   var horizontalIntersect = true;
   var enableMouseLine = true;
   var hideIntersections = false;
   var scaler = 0.48;

   var savedILines = [];

   //set for 50fps
   var updateInt = setInterval(Update, 20);

   var selectedTab;
   var inputType;
   SetInputType(document.getElementById('input-type-select').children[0]);

   var inputX = document.getElementById('inputX');
   var inputY = document.getElementById('inputY');

   function CheckKey(event) {
       var key = event.keyCode || event.charCode;
       //allowed keys are 1-9, backspace, delete and -
       return (key >= 48 && key <= 57) || key == 8 || key == 46 || key == 45;
   };

   function AddPoint() {
       if (!IsValid(inputX) || !IsValid(inputY))
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
       cell2.innerHTML = "<input type='text' onkeypress='return CheckKey(event)' value='" + inputX.value + "'>";
       cell3.innerHTML = "<input type='text' onkeypress='return CheckKey(event)' value='" + inputY.value + "'>";
       cell4.innerHTML = "<button class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored' onclick='RemovePoint(" + nextIndex + ")'> <i class='material-icons'>remove</i></button>";

       inputX.value = "";
       inputY.value = "";
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

   function RemovePoint(index) {
       for (var i = 0; i < table.rows.length; i++) {
           if (table.rows[i].dataset.id == index) {
               table.deleteRow(i);
               break;
           }
       }
   };

   function Rebuild() {
       canvas.width = window.innerWidth;
       canvas.height = window.innerHeight;
       halfWidth = canvas.width / 2;
       halfHeight = canvas.height / 2;
       maxSize = canvas.width > canvas.height ? canvas.height : canvas.width;
       halfMaxSize = maxSize / 2;

   };

   function Update() {
       ctx.clearRect(0, 0, canvas.width, canvas.height);
       ctx.strokeStyle = "#000000";
       var array = [];
       scale = 9999;

       for (var i = 1; i < table.rows.length; i++) {
           var posX = parseFloat(table.rows[i].cells[0].children[0].value);
           var posY = parseFloat(table.rows[i].cells[1].children[0].value);

           if (posX != 0) {
               scaleX = maxSize / Math.abs(posX);
               if (scaleX < scale) scale = scaleX;
           }

           if (posY != 0) {
               scaleY = maxSize / Math.abs(posY);
               if (scaleY < scale) scale = scaleY;
           }

           array.push(ModifyPosition({
               x: posX,
               y: posY
           }));
       }

       DrawBase();
       if (array.length > 1) {
           array.push(array[0]);

           DrawLines(array);

           if (!hideIntersections)
               DrawIntersections(array);
       }
   };

   //Draws the base cross
   function DrawBase() {
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

   function DrawLines(array) {
       ctx.strokeStyle = "#000";
       ctx.lineWidth = 2;

       for (var i = 0; i < array.length - 1; i++) {
           ctx.beginPath();
           ctx.moveTo(array[i].x, array[i].y);
           ctx.lineTo(array[i + 1].x, array[i + 1].y);
           ctx.stroke();
       }
   };

   //Modifies positions to better fit display
   function ModifyPosition(position) {
       var halfScale = scale * scaler;
       return {
           origX: position.x,
           origY: position.y,
           x: position.x * halfScale + halfWidth,
           y: -position.y * halfScale + halfHeight
       };
   };

   function DrawIntersections(array) {
       for (var i = 0; i < savedILines.length; i++)
           DrawIntersection(savedILines[i], array, true);

       if (enableMouseLine)
           DrawIntersection(GetMouseLine(), array, false);
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

       //if intersections found, draw
       if (intersections.length > 0) {
           //draws base line for the intersections
           ctx.beginPath();
           ctx.lineWidth = 2;
           ctx.setLineDash([10]);
           ctx.moveTo(iLine.start.x, iLine.start.y);
           ctx.lineTo(iLine.end.x, iLine.end.y);
           ctx.closePath();
           ctx.strokeStyle = '#9297B5';
           ctx.stroke();
           ctx.setLineDash([0]);
           //draw every intersection point found
           for (var i = 0; i < intersections.length; i++) {
               if (enableMouseInteraction)
                   var mouseInRange = IsMouseInRange(intersections[i], 10);
               else
                   var mouseInRange = false;

               var radius = mouseInRange ? 10 : 5;
               if (mouseInRange) DrawCoords(intersections[i]);
               ctx.beginPath();
               ctx.arc(intersections[i].x, intersections[i].y, radius, 0, 2 * Math.PI, false);
               ctx.closePath();
               ctx.fillStyle = '#3F51B5';
               ctx.fill();
               ctx.lineWidth = 3;
               ctx.stroke();
           }
       }
   };

   function IsMouseInRange(pos, radius) {
       var distanceVector = {
           x: Math.abs(mouse.x - pos.x),
           y: Math.abs(mouse.y - pos.y)
       };
       var distanceSqrd = distanceVector.x * distanceVector.x + distanceVector.y * distanceVector.y;
       return distanceSqrd < radius * radius;
   };

   function GetMouseLine() {
       if (horizontalIntersect)
           return {
               start: {
                   x: halfWidth - halfMaxSize,
                   y: mouse.y
               },
               end: {
                   x: halfWidth + halfMaxSize,
                   y: mouse.y
               }
           };
       else
           return {
               start: {
                   x: mouse.x,
                   y: halfHeight - halfMaxSize
               },
               end: {
                   x: mouse.x,
                   y: halfHeight + halfMaxSize
               }
           };
   };

   function CheckLineIntersection(line1, line2) {
       // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
       var denominator, a, b, numerator1, numerator2, result = {
           x: null,
           y: null,
           intersects: false
       };
       denominator = ((line2.end.y - line2.start.y) * (line1.end.x - line1.start.x)) - ((line2.end.x - line2.start.x) * (line1.end.y - line1.start.y));

       if (denominator == 0) {
           return result;
       }

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

           var scaleFix = (scale * scaler * 2);
           result.origX = (result.x - halfWidth) / scaleFix * 2;
           result.origY = (result.y - halfHeight) / scaleFix * 2;
       }

       return result;
   };

   function DrawCoords(pos) {
       ctx.globalAlpha = 0.9;
       ctx.fillStyle = '#757575';
       DrawRoundedRect(pos.x - 30, pos.y + 15, 60, 30, 7, true, false);
       ctx.globalAlpha = 1;
       ctx.fillStyle = '#ffffff';

       ctx.font = "500 11px Roboto";

       ctx.textAlign = 'center';
       ctx.fillText("x: " + pos.origX.toFixed(2), pos.x, pos.y + 27);
       ctx.fillText("y: " + pos.origY.toFixed(2), pos.x, pos.y + 40);
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

   //onmove sets mouse position
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