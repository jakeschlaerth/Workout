const baseURL = `http://localhost:19191`;  // `http://flip2.engr.oregonstate.edu:19191` when live;

// basic get request, builds table
var req = new XMLHttpRequest();
req.open("GET", baseURL, true);
req.onload = (e) => {
    if (req.readyState === 4) {
        if (req.status === 200) {
            var response = JSON.parse(req.responseText);
            var allRows = response.rows
            makeTable(allRows)
        } else {
            console.error(req.statusText);
        }
    }
};
req.send();

// reference for workout table
const table = document.getElementById('workoutTable');

const makeTable = (allRows) => {
    for (var row = 0; row < allRows.length; row++) {
        var currentRow = allRows[row];
        makeRow(currentRow, table);
    };
}; 

const makeRow = (currentRow, table) => {
    // reference for workoutTable body
    var tbody = table.firstElementChild;
    // new row
    var row = document.createElement("tr");

    // id will be hidden
    // new cell
    var idCell = document.createElement("td");
    // new cell text
    var idCellText = document.createTextNode(currentRow.id);
    // hide cell
    idCell.style.visibility = "hidden";
    // append text to cell
    idCell.appendChild(idCellText);
    // append cell to row
    row.appendChild(idCell);

    // make cell for each datum
    makeCell(currentRow.name, row);
    makeCell(currentRow.reps, row)
    makeCell(currentRow.weight, row)

    // convert unit boolean to lbs or kg
    if (currentRow.unit === 0) {
        makeCell("lbs", row);
    } else {
        makeCell("kg", row);
    }

    // format date
    var rawDate = currentRow.date;
    var formatDate = rawDate.substring(0, 10)
    makeCell(formatDate, row)

    // update button
    updateButton = document.createElement("button");
    updateButton.innerHTML = "update";
    updateButton.id = "updateButton";
    // new cell
    var updateCell = document.createElement("td")
    // append button to cell
    updateCell.appendChild(updateButton)
    // append cell to row
    row.append(updateCell)

    // delete button
    deleteButton = document.createElement("button");
    deleteButton.innerHTML = "delete";
    deleteButton.id = "deleteButton";
    // new cell
    var deleteCell = document.createElement("td")
    // append button to cell
    deleteCell.appendChild(deleteButton)
    // append cell to row
    row.append(deleteCell)

    // append row to tbody
    tbody.appendChild(row)
};

const makeCell = (data, row) => {
    // new cell
    var cell = document.createElement("td");
    // new cell text
    var cellText = document.createTextNode(data);
    // append text to cell
    cell.appendChild(cellText);
    // append cell to row
    row.appendChild(cell);
};

const deleteTable = (allRows) => {
    // when changing the table, remove the old table
    currentDataRow = table.firstElementChild.firstElementChild
    while (currentDataRow.nextElementSibling != null) {
        currentDataRow.nextElementSibling.remove();
    }   
};

// submit row POST request, add row
const newRowSubmit = document.getElementById('postForm');
newRowSubmit.addEventListener('submit', (e) => {
    e.preventDefault();
    var req = new XMLHttpRequest();
    var payload = {
        name: null, 
        reps: null, 
        weight: null,
        unit: null,
        date: null
        };
    payload.name = document.getElementById("nameInput").value;
    payload.reps = document.getElementById("repsInput").value;
    payload.weight = document.getElementById("weightInput").value;

    // radio buttons for units
    var lbsButton = document.getElementById("lbsInput");
    var kgButton = document.getElementById("kgInput");
    if (lbsButton.checked) {
        payload.unit = 0;
    }
    if (kgButton.checked) {
        payload.unit = 1;
    }
    payload.date = document.getElementById("dateInput").value;
    req.open("POST", baseURL, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.onload = (e) => {
        if (req.readyState === 4) {
            if (req.status === 200) {
                // this is where the magic happens
                var response = JSON.parse(req.responseText);
                allRows = response.rows;
                // remove old table
                deleteTable(allRows);
                // rebuild from scratch
                makeTable(allRows);
            } else {
                console.error(req.statusText);
            }
        }
    };
    req.send(JSON.stringify(payload));
});

table.addEventListener('click', (event) => {
    let target = event.target;
    if (target.id == "updateButton") {
        onUpdate(target);
    };
    if (target.id == "deleteButton") {
        onDelete(target)
    };
    // if it is an update button, send a PUT request to the server
    // if it is a delete button, send a delete request to the server

    // delete table
    // make table again
});

const onUpdate = (target) => {
    //              button cell       row
    var updateRow = target.parentNode.parentNode
    //             button cell       row        id cell           id value
    var updateID = target.parentNode.parentNode.firstElementChild.innerHTML;

    // new header
    updateHeader = document.createElement("h1");
    // text content of header
    updateHeader.innerHTML = "Update Form";
    // append header to body
    document.body.appendChild(updateHeader);

    // starts pointing at name field
    var currentElement = updateRow.firstElementChild.nextElementSibling;

    // new form
    updateForm = document.createElement("form");
    // append form to document
    document.body.appendChild(updateForm);

    // name label
    var nameLabel = document.createElement("label");
    nameLabel.innerText = "Name:"
    // name field
    var nameInput = document.createElement("input");
    // name field input type
    nameInput.setAttribute("type", "text");
    // name of field
    nameInput.name = "name";
    // name field old value
    nameInput.defaultValue = currentElement.innerText;
    // append
    nameLabel.appendChild(nameInput);
    updateForm.appendChild(nameLabel);

    // iterate through siblings
    currentElement = currentElement.nextElementSibling;

    // reps label
    var repsLabel = document.createElement("label");
    repsLabel.innerText = "Reps:"
    //reps field
    var repsInput = document.createElement("input");
    // reps field input type
    repsInput.setAttribute("type", "number");
    // reps field old input
    repsInput.defaultValue = currentElement.innerText;
    // append
    repsLabel.appendChild(repsInput);
    updateForm.appendChild(repsLabel);

    // iterate through siblings
    currentElement = currentElement.nextElementSibling;

    // weight label
    var weightLabel = document.createElement("label");
    weightLabel.innerText = "Weight:"
    //weight field
    var weightInput = document.createElement("input");
    // weight field input type
    weightInput.setAttribute("type", "number");
    // weight field old input
    weightInput.defaultValue = currentElement.innerText;
    // append
    weightLabel.appendChild(weightInput);
    updateForm.appendChild(weightLabel);

    // iterate through siblings
    currentElement = currentElement.nextElementSibling;

    // units radio selector
    // lbs label
    var lbsLabel = document.createElement("label");
    lbsLabel.innerText = "lbs"
    // lbs
    var lbsInput = document.createElement("input");
    // lbs input type
    lbsInput.setAttribute("type", "radio");
    lbsInput.value = 0;
    lbsInput.name = "units";
    if (currentElement.innerText == "lbs") {
        lbsInput.defaultChecked = true;
    };
    // append
    lbsLabel.appendChild(lbsInput);
    updateForm.appendChild(lbsLabel);
    // kg label
    var kgLabel = document.createElement("label");
    kgLabel.innerText = "kg"
    // kg
    var kgInput = document.createElement("input");
    // kg input type
    kgInput.setAttribute("type", "radio");
    // default value
    // <input type="radio" name="units" value="0" id="kgInput" checked/>kg
    kgInput.value = 1;
    kgInput.name = "units";
    if (currentElement.innerText == "kg") {
        kgInput.defaultChecked = true;
    };
    // append
    kgLabel.appendChild(kgInput);
    updateForm.appendChild(kgLabel);

    // iterate through siblings
    currentElement = currentElement.nextElementSibling;

    // date label
    var dateLabel = document.createElement("label");
    dateLabel.innerText = "Date:"
    //date field
    var dateInput = document.createElement("input");
    // date field input type
    dateInput.setAttribute("type", "date");
    // date field old input
    dateInput.defaultValue = currentElement.innerText;
    // append
    dateLabel.appendChild(dateInput);
    updateForm.appendChild(dateLabel);

    // submit button
    var updateSubmit = document.createElement("input");
    updateSubmit.setAttribute("type", "submit");
    updateSubmit.value = "submit";
    // append
    updateForm.appendChild(updateSubmit);

    updateSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        
        var req = new XMLHttpRequest();   
        var updateURL = baseURL;
        var payload = {
            name: nameInput.value, 
            reps: repsInput.value, 
            weight: weightInput.value,
            unit: null,
            date: dateInput.value,
            id: updateID
            };
        // unit radio selctor value
        if (lbsInput.checked) {
            payload.unit = 0;
        };
        if (kgInput.checked) {
            payload.unit = 1;
        };
        req.open("PUT", baseURL, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.onload = (e) => {
            if (req.readyState === 4) {
                if (req.status === 200) {
                    // this is where the magic happens
                    var response = JSON.parse(req.responseText);
                    allRows = response.rows;
                    // remove old table
                    deleteTable(allRows);
                    // rebuild from scratch
                    makeTable(allRows);
                    
                } else {
                    console.error(req.statusText);
                }
            }
        }
        req.send(JSON.stringify(payload));
        updateHeader.remove();
        updateForm.remove();
    });
};

const onDelete = (target) => {
    //             button cell       row        id cell           id value
    var deleteID = target.parentNode.parentNode.firstElementChild.innerHTML;
    var req = new XMLHttpRequest();
    // include id of row to be deleted in delete request via URL query
    // copy baseURL
    var deleteURL = baseURL;
    // add id query
    deleteURL += "?id=";
    //add specific id
    deleteURL += deleteID;
    req.open("DELETE", deleteURL, true);
    req.onload = (e) => {
        if (req.readyState === 4) {
            if (req.status === 200) {
                // this is where the magic happens
                var response = JSON.parse(req.responseText);
                allRows = response.rows;
                // remove old table
                deleteTable(allRows);
                // rebuild from scratch
                makeTable(allRows);
            } else {
                console.error(req.statusText);
            }
        }
    }
    req.send();
};

const resetSubmit = document.getElementById('resetForm');
resetSubmit.addEventListener('submit', (e) => {
    e.preventDefault();
    var req = new XMLHttpRequest();
    var resetURL = baseURL;
    resetURL += "/reset-table";
    req.open("GET", resetURL, true);
    req.onload = (e) => {
        if (req.readyState === 4) {
            if (req.status === 200) {
                // this is where the magic happens
                deleteTable();
                // we dont need to rebuild table since it will be empty after reset
            } else {
                console.error(req.statusText);
            }
        }
    }
    req.send();
});