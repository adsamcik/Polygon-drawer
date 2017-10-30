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

        if (value instanceof Polygon) {
            var p = <Polygon>value;
            for (var i = 0; i < p.points.length; i++)
                this.AddToTable(i, p.GetPoint(i));

            var row = this.table.t.insertRow(this.row.rowIndex + p.points.length + 1);
            cell = row.insertCell(0);
            cell.colSpan = 4;
            cell.innerHTML = "<button class='mdc-button' style='margin: 0 auto;display:block;'>Add coord</button>";
            var _this = this;
            cell.children[0].addEventListener('click', event => { _this.Add(Coord.zero) });
        }
        else
            this.AddToTable(0, this.value.coord);
    }

    Add(item: Coord) {
        changed = true;
        if (this.value instanceof Polygon) {
            var p = (<Polygon>this.value);
            p.AddPoint(item.x, item.y, item instanceof Vector);
            this.AddToTable(p.points.length - 1, p.GetPoint());
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
                if (p.points.length == 0) {
                    this.table.t.deleteRow(this.row.rowIndex + 1);
                    this.table.RemoveElementValue(this);
                }
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

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        this.value.GenerateTableFieldsFor(row);

        cell4.innerHTML = "<button class='mdc-button'><img src='icons/remove.svg' width='24px'></button>";
        var btn = <HTMLButtonElement>cell4.firstChild;
        var _this = this;
        btn.addEventListener("click", function (event) { _this.Remove(_this.CalcRowIndex(event)); }, false);
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
        this.elements.splice(index, 1);
    }
} 