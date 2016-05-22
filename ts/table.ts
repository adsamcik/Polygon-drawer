class TableElement {
    row: HTMLTableRowElement;
    table: Table;
    value: Shape;

    constructor(table: Table, value: Shape) {
        this.table = table;
        this.value = value;

        this.row = table.t.insertRow();
        var cell = this.row.insertCell(0);
        cell.colSpan = 4;
        cell.innerText = value.constructor.name;
        polygonSelect.add(GenerateOption("Polygon"));

        if (value instanceof Polygon) {
            var p = <Polygon>value;
            for (var i = 0; i < p.points.length; i++) {
                this.AddToTable(i, p.GetPoint(i));
            }
        }
        else {
            //ToDo Make this more verbose
            this.AddToTable(0, (<Point>this.value).coord)
        }
    }

    Add(item: Coord) {
        if (this.value instanceof Polygon) {
            var p = (<Polygon>this.value);
            p.AddPoint(item.x, item.y, item instanceof Vector);
            this.AddToTable(p.points.length-1, p.GetPoint());
        }
        else
            console.error("Element " + item.constructor.name + " on row index " + this.row.rowIndex + " does not support adding items");
    }

    Remove(index: number = -1) {
        if (this.value instanceof Polygon) {
            var p = (<Polygon>this.value);
            if (index == -1) {
                for (var i = p.points.length; i >= 0; i--)
                    this.table.t.deleteRow(this.row.rowIndex + i);
                this.table.RemoveElementValue(this);
            }
            else {
                this.RemoveRow(index);
                p.RemovePoint(index);
                if (p.points.length == 0)
                    this.table.RemoveElementValue(this);
            }
        }
        else {
            if (index < -1 || index > 0)
                console.error("Removing invalid index " + this.constructor.name + " cannot have more values than 1");
            this.RemoveRow(0);
            this.table.RemoveElementValue(this);
        }
    }

    RemoveRow(rowIndex: number) {
        if (rowIndex < 0 || (rowIndex > 0 && !(this.value instanceof Polygon))) {
            console.error("Row (" + rowIndex + ") does not belong to element " + this.value.constructor.name + " on index " + this.row.rowIndex);
            return;
        }
        this.table.t.deleteRow(this.row.rowIndex + 1 + rowIndex);
        changed = true;
    }

    private AddToTable(index: number, c: Coord) {
        var row = this.table.t.insertRow(this.row.rowIndex + index + 1);

        //insert cells
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        //fill cells
        cell1.innerHTML = "<img src='icons/" + (c instanceof Vector ? "vector" : "point") + ".svg' width='24'>";
        cell1.className = 'cellCollapsed';
        cell2.innerHTML = "<input type='text' data-type='x' value='" + c.x + "'>";
        cell3.innerHTML = "<input type='text' data-type='y' value='" + c.y + "'>";
        cell4.innerHTML = "<button class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored'><img src='icons/remove.svg' width='24px'></button>";
        var btn = <HTMLButtonElement>cell4.firstChild;
        var _this = this;
        btn.addEventListener("click", function (event) { _this.Remove(_this.CalcRowIndex(event)); }, false);

        cell2.firstChild.addEventListener("input", function (event) { _this.InputChange(<KeyboardEvent>event); }, false);
        cell3.firstChild.addEventListener("input", function (event) { _this.InputChange(<KeyboardEvent>event); }, false);
    }

    private InputChange(event: Event) {
        var e = (<HTMLInputElement>event.target);
        if (e.value != "-" && parseInt(e.value) != NaN) {
            if (this.value instanceof Polygon) {
                var val = (<Polygon>this.value).points[this.CalcRowIndex(event)];
                console.log(val);
                if (parseInt(e.value) != NaN) {
                    var type = e.dataset["type"];
                    switch (type) {
                        case 'x':
                            val.x = parseInt(e.value);
                            break;
                        case 'y':
                            val.y = parseInt(e.value);
                            break;
                    }
                    changed = true;
                }
                console.log(val);
            }
            return true;
        }
        
        return e.value == "" || e.value == "-"? true : false;
    }

    CalcRowIndex(event: Event) {
        return (<HTMLTableRowElement>(<HTMLElement>event.target).parentElement.parentElement).rowIndex - this.row.rowIndex - 1;
    }
}

class Table {
    t: HTMLTableElement;
    elements: TableElement[];
    constructor(table: HTMLTableElement) {
        this.t = table;
        this.elements = [];
    }

    AddElement(s: Shape) {
        changed = true;
        return this.elements.push(new TableElement(this, s)) - 1;
    }

    AddValue(index: number, s: Coord) {
        this.elements[index].Add(s);
        changed = true;
    }

    GetElement(index: number = -1) {
        if (index == -1)
            return this.elements[this.elements.length - 1];
        return this.elements[index];
    }

    RemoveElement(index: number) {
        this.t.deleteRow(this.elements[index].row.rowIndex);
        this.elements.splice(index, 1);
    }

    RemoveElementValue(val: TableElement) {
        var index = this.elements.indexOf(val);
        this.t.deleteRow(val.row.rowIndex);
        polygonSelect.remove(index + 2);
        this.elements.splice(index, 1);
    }
} 