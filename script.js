function clearall() {
  const inputs = document.querySelectorAll("input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = "0";
  }
  const dbox = document.querySelector(".dbox");
  dbox.innerHTML = "";
}

function buildEqn() {
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
    if(i == order) input.value = 1;
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
  const order = document.getElementById("order").value;
  const coefficients = [];

  // Get the value of each input element and push it to the coefficients array
  for (let i = 0; i <= order; i++) {
    const input = document.getElementById(String.fromCharCode(97 + i));
    coefficients.push(parseFloat(input.value));
  }
  console.log(coefficients);
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