class TableElement {
    row: HTMLTableRowElement;
    table: HTMLTableElement;
    value: Shape;

    constructor(table: HTMLTableElement, value: Shape) {
        this.table = table;
        this.value = value;

        this.row = table.insertRow();
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
    }

    Add(item: Coord) {
        if (this.value instanceof Polygon) {
            var p = (<Polygon>this.value);
            p.AddPoint(item.x, item.y, item instanceof Vector);
            this.AddToTable(p.points.length, p.GetPoint());
        }
        else
            console.error("Element " + item.constructor.name + " on row index " + this.row.rowIndex + " does not support adding items");
    }

    Remove(index: number = -1) {
        if (index == -1) {
            if (this.value instanceof Polygon) {
                for (var i = (<Polygon>this.value).points.length; i >= 0; i--)
                    this.table.deleteRow(this.row.rowIndex + i);
            }
            else
                this.table.deleteRow(this.row.rowIndex);
        }
        else
            this.table.deleteRow(index);
    }

    RemoveRow(rowIndex: number) {
        var index = (rowIndex - this.row.rowIndex) - 1;
        if (index < 0 || (index > 0 && !(this.value instanceof Polygon))) {
            console.error("Row does not belong to element " + this.value.constructor.name + " on index " + this.row.rowIndex);
            return;
        }
        console.log(index + "  " + rowIndex + " - " + this.row.rowIndex);
        (<Polygon>this.value).RemovePoint(index);
        this.table.deleteRow(rowIndex);
    }

    private AddToTable(index: number, c: Coord) {
        var row = this.table.insertRow(this.row.rowIndex + index);

        //insert cells
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        //fill cells
        cell1.innerHTML = "<img src='icons/" + (c instanceof Vector ? "vector" : "point") + ".svg' width='24'>";
        cell1.className = 'cellCollapsed';
        cell2.innerHTML = "<input type='text' onkeypress='return CheckKey(event)' value='" + c.x + "'>";
        cell3.innerHTML = "<input type='text' onkeypress='return CheckKey(event)' value='" + c.y + "'>";
        cell4.innerHTML = "<button class='mdl-button mdl-js-button mdl-button--icon mdl-button--colored'><img src='icons/remove.svg' width='24px'></button>";
        var btn = <HTMLButtonElement>cell4.firstChild;
        var _this = this;
        btn.addEventListener("click", function (event) {
            _this.RemoveRow((<HTMLTableRowElement>(<HTMLButtonElement>event.target).parentElement.parentElement).rowIndex);
        }, false);
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
        return this.elements.push(new TableElement(this.t, s)) - 1;
    }

    AddValue(index: number, s: Coord) {
        this.elements[index].Add(s);
    }

    GetElement(index: number = -1) {
        if (index == -1)
            return this.elements[this.elements.length - 1];
        return this.elements[index];
    }
} 