function clearall() {
  const inputs = document.querySelectorAll("input");
  const answer = document.getElementById("answer");
  answer.innerHTML = "";
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].id == "order") continue;
    inputs[i].value = "0";
  }
  const dbox = document.querySelector(".dbox");
  dbox.innerHTML = "";
}

function buildEqn() {
  const answer = document.getElementById("answer");
  answer.innerHTML = "";
  const order = document.getElementById("order").value;
  const eqnBox = document.querySelector(".quadeqbox");

  // Remove any existing equation inputs
  eqnBox.innerHTML = "";

  // Create input elements for each coefficient
  for (let i = 0; i <= order; i++) {
    const input = document.createElement("input");
    input.type = "number";
    input.autocomplete = "off";
    input.id = String.fromCharCode(97 + i);
    if (i == order) input.value = 1;
    else input.value = 0;
    input.classList.add("input-margin-bottom"); // add class to input element
    eqnBox.appendChild(input);

    if (i < order) {
      const vbox = document.createElement("span");
      vbox.className = "vboxvar";
      vbox.innerHTML = `S<sup>${order - i}</sup>+`;
      if (order - i < 10)
        vbox.style.margin = "0.5%";
      eqnBox.appendChild(vbox);
    }
  }

  const equals = document.createElement("span");
  equals.className = "vboxvar";
  equals.innerHTML = "= 0";
  eqnBox.appendChild(equals);
}



function quadcalc() {
  const answer = document.getElementById("answer");
  answer.innerHTML = "";
  const order = document.getElementById("order").value;
  const coefficients = [];

  // Get the value of each input element and push it to the coefficients array
  for (let i = 0; i <= order; i++) {
    const input = document.getElementById(String.fromCharCode(97 + i));
    coefficients.push(parseFloat(input.value));
  }
  let ans = solveSystem(coefficients, order);
  let routh = ans[0];
  const table = document.createElement("table");

  console.log("r", routh);
  // create table body rows
  for (var i = routh.length - 1; i >= 0; i--) {
    var bodyRow = document.createElement("tr");
    var label = document.createElement("td");
    label.innerHTML = `<span>S<sup>${i}</sup></span>`;
    bodyRow.appendChild(label);
    for (var j = 0; j < routh[i].length; j++) {
      var bodyCell = document.createElement("td");
      bodyCell.textContent = routh[i][j];
      bodyRow.appendChild(bodyCell);
    }
    table.appendChild(bodyRow);
  }
  answer.appendChild(table);
  let stable = document.createElement("h4");
  stable.textContent = ans[1];
  if (ans[1].indexOf("unstable") !== -1) {
    stable.style.color = "#dc3545";
  }
  else {
    stable.style.color = "#28a745";
  }
  answer.appendChild(stable);
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    // Prevent page from reloading
    event.preventDefault();
    // Call your function
    buildEqn();
  } else if (event.key === "Delete") {
    clearall();
  }
});

function check(routhTable) {
  let x = 0;
  for (let i = 1; i < routhTable.length; i++) {
    if (routhTable[i][0] * routhTable[i - 1][0] < 0) {
      x++;
    }
  }
  if (x === 0) {
    return `System is stable`;
  }
  if (x === 1) {
    return `System is unstable, it has 1 pole in the right half-plane.`;
  }
  return `System is unstable, it has ${x} poles in the right half plane.`;
}

function checkZeroRow(row) {
  console.log(`now iam check ${row} with length ${row.length}`);
  for (let i = 0; i < row.length; i++) {
    console.log(row[i]);
    if (row[i] != 0) {
      return false;
    }
  }
  return true;
}

function solveSystem(coefficients, order) {
  coefficients.reverse();

  if (order == 0) {
    return `System is stable`;
  }

  if (order == 1) {
    if (coefficients[1] * coefficients[0] >= 0) {
      return `System is stable`;
    } else {
      return `System is unstable, it has 1 pole in the right half-plane.`;
    }
  }

  // for debugging
  for (let i = 0; i <= order; i++) {
    console.log(`coeff of ${i} = ${coefficients[i]}`);
  }

  // initiate the routh table
  const routhTable = new Array();
  for (let i = 0; i <= order; i++) {
    routhTable.push([]);
  }

  // set the first row
  for (let i = order; i >= 0; i -= 2) {
    routhTable[order].push(coefficients[i]);
  }
  routhTable[order].push(0);

  // set second row
  for (let i = order - 1; i >= 0; i -= 2) {
    routhTable[order - 1].push(coefficients[i]);
  }
  routhTable[order - 1].push(0);

  // get the rest of the table
  for (let i = order - 2; i >= 0; i--) {
    for (let j = 0; j < i; j++) {
      let sz = routhTable[i].length;
      let f1 = routhTable[i + 1][0];
      let f2 = routhTable[i + 2][0];
      let f3 = routhTable[i + 2][sz + 1];
      let f4 = routhTable[i + 1][sz + 1];
      console.log(i + " " + sz + " " + f1 + " " + f2 + " " + f3 + " " + f4);
      routhTable[i].push((f1 * f3 - f2 * f4) / f1);
      console.log((f1 * f3 - f2 * f4) / f1);
    }
    if (i === 0) {
      let f1 = routhTable[1][0];
      let f2 = routhTable[2][0];
      let f3 = routhTable[2][1];
      let f4 = routhTable[1][1];
      routhTable[i].push((f1 * f3 - f2 * f4) / f1);
      console.log((f1 * f3 - f2 * f4) / f1);
      if (routhTable[0][0] === 0) {
        routhTable[0][0] = Number.EPSILON;
      }
      break;
    }
    routhTable[i].push(0);
    if (checkZeroRow(routhTable[i])) {
      console.log(`row ${i} all zeroes`);
      console.log(routhTable[i]);
      routhTable[i] = getNewCoeffs(routhTable[i + 1], i + 1);
      console.log(`new row ${i} = ${routhTable[i]}`);
    } else if (routhTable[i][0] == 0) {
      console.log(`row ${i} starts with zero`);
      console.log(routhTable[i]);
      routhTable[i][0] = Number.EPSILON;
      if (routhTable[i + 1][0] < 0) {
        routhTable[i][0] *= -1;
      }
      console.log(routhTable[i]);
    }
  }
  console.log(routhTable);
  return [routhTable, check(routhTable)];
}

function getNewCoeffs(row, order) {
  const arr = new Array();
  for (let i = 0; i < order; i++) {
    arr.push(row[i] * (order - i * 2));
  }
  return arr;
}