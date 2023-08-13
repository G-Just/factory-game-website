function projectionCoordinates() {
  x = Math.floor((mouse.x - 160) / 32) * 32;
  y = Math.floor((mouse.y - 10) / 32) * 32;
  img.style.left = `${x + 160}px`;
  img.style.top = `${y + 10}px`;
}

function projectionRemove() {
  img.style.display = "none";
  // not needed. Coordinates will update (remove if lag issues? -> unlikely)
  // canvas.removeEventListener("mousemove", projectionCoordinates);
}

function project(type) {
  if (!buildSelected) {
    switch (type) {
      case "mine":
        img.style.display = "block";
        img.setAttribute("src", "./art/mine.png");
        break;
      case "conveyor":
        img.style.display = "block";
        img.setAttribute(
          "src",
          "./art/conveyorBelt" + directions[currentDirection] + ".png"
        );
        break;
      case "smelter":
        img.style.display = "block";
        img.setAttribute("src", "./art/smelter.png");
        break;
      case "remove":
        img.style.display = "block";
        img.setAttribute("src", "./art/remove.png");
        break;
    }
    canvas.addEventListener("mousemove", projectionCoordinates);
  }
}

function buildEvent(type) {
  tooltip.style.display = "block";
  //case looks if user has enough xp and disables the building event if not
  switch (type) {
    case "mine":
      if (xp < mineCost) {
        tooltip.innerHTML = "Not enough money";
        setTimeout(() => {
          tooltip.style.display = "none";
        }, 1000);
        return;
      }
      break;
    case "conveyor":
      if (xp < conveyorCost) {
        tooltip.innerHTML = "Not enough money";
        setTimeout(() => {
          tooltip.style.display = "none";
        }, 1000);
        return;
      }
      break;
    case "smelter":
      if (xp < smelterCost) {
        tooltip.innerHTML = "Not enough money";
        setTimeout(() => {
          tooltip.style.display = "none";
        }, 1000);
        return;
      }
      break;
  }
  // start projection event (takes the html element and adds mousemove follow)
  project(type);
  // text of what is currently selected
  // changes the text based on what was selected
  switch (type) {
    case "mine":
      tooltip.innerHTML = "Now building : Mine";
      break;
    case "conveyor":
      tooltip.innerHTML = "Now building : Conveyor";
      break;
    case "smelter":
      tooltip.innerHTML = "Now building : Smelter";
      break;
    case "remove":
      tooltip.innerHTML = "Click to remove a building";
      break;
  }
  buildSelected = true;
  // adds click event to the canvass and executes build on click
  canvas.addEventListener("click", function build() {
    x = Math.floor((mouse.x - 160) / 32);
    y = Math.floor((mouse.y - 10) / 32);
    const position = { x: x, y: y };
    switch (type) {
      case "mine":
        if (grid[y][x] === "iron") {
          tooltip.style.display = "none";
          xp -= mineCost;
          new Building(type, position).add();
          buildSelected = false;
          projectionRemove();
        } else {
          tooltip.innerHTML = "Invalid location";
          setTimeout(() => {
            tooltip.style.display = "none";
          }, 1000);
          projectionRemove();
        }
        break;
      case "conveyor":
        if (grid[y][x] === "empty") {
          tooltip.style.display = "none";
          xp -= conveyorCost;
          new Building(type, position, directions[currentDirection]).add();
          buildSelected = false;
          projectionRemove();
        } else {
          tooltip.innerHTML = "Invalid location";
          setTimeout(() => {
            tooltip.style.display = "none";
          }, 1000);
          projectionRemove();
        }
        break;
      case "smelter":
        if (grid[y][x] === "empty") {
          tooltip.style.display = "none";
          xp -= smelterCost;
          new Building(type, position).add();
          buildSelected = false;
          projectionRemove();
        } else {
          tooltip.innerHTML = "Invalid location";
          setTimeout(() => {
            tooltip.style.display = "none";
          }, 1000);
          projectionRemove();
        }
        break;
      case "remove":
        switch (grid[y][x]) {
          case "mine":
            tooltip.style.display = "none";
            xp += mineCost;
            grid[y][x] = "iron";
            buildSelected = false;
            projectionRemove();
            break;
          case "conveyorE":
          case "conveyorEN":
          case "conveyorES":
          case "conveyorN":
          case "conveyorNE":
          case "conveyorNW":
          case "conveyorS":
          case "conveyorSE":
          case "conveyorSW":
          case "conveyorW":
          case "conveyorWN":
          case "conveyorWS":
            tooltip.style.display = "none";
            xp += conveyorCost;
            grid[y][x] = "empty";
            buildSelected = false;
            projectionRemove();
            break;
          case "smelter":
            tooltip.style.display = "none";
            smelterCost -= smelterCount * 20;
            smelterCount--;
            xp += smelterCost;
            console.log("$", smelterCost);
            console.log("Smelters", smelterCount);
            grid[y][x] = "empty";
            buildSelected = false;
            projectionRemove();
            break;
          case "empty":
            tooltip.style.display = "none";
            buildSelected = false;
            projectionRemove();
        }
        break;
    }
    this.removeEventListener("click", build);
    buildSelected = false;
  });
}
