/** @format */
  //>>>>>>>>>>>>>> Get Current Location Functions >>>>>>>>>>>>>>>
  function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      document.getElementById("location").innerHTML =
        "Geolocation is not supported by this browser.";
    }
    console.log("jhg");
  }

  function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    document.getElementById("location").innerHTML =
      "Latitude: " + latitude + "<br>Longitude: " + longitude;
  }
document.addEventListener("DOMContentLoaded", function () {


  //>>>>>>>>>>>>>> To-Do List Functions >>>>>>>>>>>>>>>
  var allboxes = document.querySelectorAll(".box");
  var addform = document.querySelector(".add-form");
  var addInput = document.querySelector("input");

  // Update the "to-do" box with an ID
  var todobox = document.getElementById("todo-box");

  function saveBoxesToLocalStorage() {
    var boxState = {};
    allboxes.forEach((box) => {
      var boxId = box.id;
      boxState[boxId] = Array.from(box.querySelectorAll(".task")).map(
        (task) => task.innerHTML
      );
    });
    localStorage.setItem("boxState", JSON.stringify(boxState));
  }

  addform.addEventListener("submit", function (e) {
    e.preventDefault();
    var newTasktext = addInput.value;
    if (!newTasktext) return;
    var newTask = createTaskElement(newTasktext);
    todobox.appendChild(newTask);
    saveBoxesToLocalStorage();
    addInput.value = "";
  });

  for (let index = 0; index < allboxes.length; index++) {
    allboxes[index].addEventListener("dragover", function (e) {
      e.preventDefault();
      var currentTask = document.querySelector(".is-dragging");
      allboxes[index].appendChild(currentTask);
      saveBoxesToLocalStorage();
    });
  }

  // Function to load the state of boxes from local storage
  function loadBoxesFromLocalStorage() {
    var boxState = JSON.parse(localStorage.getItem("boxState")) || {};

    for (var boxId in boxState) {
      if (boxState.hasOwnProperty(boxId)) {
        var box = document.getElementById(boxId);

        if (box) {
          box.innerHTML = "";
          var title = document.createElement("h3");
          title.classList.add("heading");
          title.textContent = boxId.charAt(0).toUpperCase() + boxId.slice(1);
          box.appendChild(title);

          boxState[boxId].forEach((taskText) => {
            var newTask = createTaskElement(taskText);
            box.appendChild(newTask);
          });
        }
      }
    }
  }

  // Render tasks from local storage on page load
  loadBoxesFromLocalStorage();

  function createTaskElement(taskText) {
    var newTaskContainer = document.createElement("div");
    newTaskContainer.classList.add("task-container");

    var newTask = document.createElement("p");
    newTask.classList.add("task");
    newTask.setAttribute("draggable", "true");
    newTask.innerHTML = taskText;

    var deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.innerHTML = "Delete";
    deleteButton.addEventListener("click", function () {
      newTaskContainer.remove();
      saveBoxesToLocalStorage();
    });

    newTaskContainer.appendChild(newTask);
    newTaskContainer.appendChild(deleteButton);

    newTaskContainer.addEventListener("dragstart", function () {
      newTaskContainer.classList.add("is-dragging");
      saveBoxesToLocalStorage();
    });

    newTaskContainer.addEventListener("dragend", function () {
      newTaskContainer.classList.remove("is-dragging");
      saveBoxesToLocalStorage();
    });

    return newTaskContainer;
  }

  //>>>>>>>>>>>>>> Reset Button Functionality >>>>>>>>>>>>>>>
  var resetBtn = document.getElementById("reset-btn");
  resetBtn.addEventListener("click", function () {
    // Clear local storage
    localStorage.removeItem("boxState");

    // Remove all tasks from the boxes
    allboxes.forEach((box) => {
      box.innerHTML = "";
      var title = document.createElement("h3");
      title.classList.add("heading");
      title.textContent = box.id.charAt(0).toUpperCase() + box.id.slice(1);
      box.appendChild(title);
    });

    // Clear the input field
    addInput.value = "";

    // Save the updated state to local storage
    saveBoxesToLocalStorage();
  });
});
