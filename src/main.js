import { exportConfiguration } from "./scripts/export";
import { loadPartsData } from "./scripts/loadPartsData";
import { setPartsCost } from "./scripts/setCoast";
import { updateColors } from "./scripts/updateColors";

const toggleSwitch = document.getElementById("toggleSwitch");
const valueDisplay = document.getElementById("selected-frame-title");
const appElement = document.getElementById("app");
const workingArea = document.getElementById("working-area");

async function initialize() {
  const price = await loadPartsData();
  setPartsCost(price);
  setupDragAndDrop();
}

let MODE = "type-7";
valueDisplay.textContent = toggleSwitch.checked ? "Selected Frame: 10" : "Selected Frame: 7";
MODE = toggleSwitch.checked ? "type-10" : "type-7";
appElement.setAttribute("data-mode", MODE);

toggleSwitch.addEventListener("change", () => {
  if (toggleSwitch.checked) {
    valueDisplay.textContent = "Selected Frame: 10";
    MODE = "type-10";
  } else {
    valueDisplay.textContent = "Selected Frame: 7";
    MODE = "type-7";
  }

  appElement.setAttribute("data-mode", MODE);
  updateColors(appElement, MODE);
});

updateColors(appElement, MODE);

let totalCost = 0;
let addedParts = {};

const limit = {
  frame: 1,
  motor: 4,
  battery: 1,
  flight_controller: 1,
  camera: 1,
  video_antenna: 1,
  radio_module: 1,
};

function setupDragAndDrop() {
  document.querySelectorAll(".part ").forEach(option => {
    option.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", e.target.src);
      e.dataTransfer.setData("part-type", e.target.dataset.type);
      e.dataTransfer.setData("part-size", e.target.dataset.size);
      e.dataTransfer.setData("part-cost", e.target.dataset.cost);
    });
  });

  workingArea.addEventListener("dragover", e => {
    e.preventDefault();
  });

  workingArea.addEventListener("drop", e => {
    e.preventDefault();

    const imgSrc = e.dataTransfer.getData("text/plain");
    const partType = e.dataTransfer.getData("part-type");
    const partSize = e.dataTransfer.getData("part-size");
    const partCost = e.dataTransfer.getData("part-cost");

    if (partType) {
      const partImage = document.createElement("img");
      partImage.src = imgSrc;
      partImage.classList.add("workAriaImage");
      partImage.dataset.type = partType;

      partImage.dataset.size = partSize === "undefined" ? "all" : partSize;
      partImage.dataset.cost = partCost;

      workingArea.appendChild(partImage);

      addPart(partImage);
    }
  });
}

function addPart(partData) {
  const partType = partData.dataset.type;
  if (!addedParts[partData.dataset.type]) {
    addedParts[partData.dataset.type] = [];
  }

  addedParts[partData.dataset.type].push(partData);
  updateCost(parseInt(partData.dataset.cost));

  if (addedParts[partType].length === limit[partType]) {
    const partImages = document.querySelectorAll(`.part[data-type="${partType}"]`);
    const rootStyles = getComputedStyle(document.documentElement);
    const greyColor = rootStyles.getPropertyValue("--grey");
    partImages.forEach(partImage => {
      partImage.draggable = false;
    });

    const images = document.querySelectorAll(`.details-wrapper .part[data-type="${partType}"]`);
    images.forEach(partImage => {
      partImage.style.backgroundColor = greyColor;
    });
  }
}

function updateCost(cost) {
  totalCost += cost;
  document.getElementById("total-cost").innerText = totalCost;
}

function clearAssembly() {
  document.getElementById("working-area").innerHTML = "";
  addedParts = {};
  totalCost = 0;
  document.getElementById("total-cost").innerText = totalCost;
  const images = document.querySelectorAll(".part");
  images.forEach(partImage => {
    const draggable = MODE !== `type-${partImage.size}` ? true : false;
    partImage.setAttribute("draggable", draggable);
  });
  updateColors(appElement, MODE);
}

document.getElementById("clearButton").addEventListener("click", clearAssembly);

document.getElementById("exportConfiguration").addEventListener("click", () => exportConfiguration(addedParts));

function removePartsOnModeChange(appElement) {
  const workingArea = document.getElementById("working-area");

  const observer = new MutationObserver(mutationsList => {
    mutationsList.forEach(mutation => {
      if (mutation.attributeName === "data-mode") {
        const partsToRemove = workingArea.querySelectorAll(
          '.workAriaImage[data-type="motor"], .workAriaImage[data-type="frame"]'
        );

        let removedCost = 0;

        partsToRemove.forEach(part => {
          const partType = part.dataset.type;
          const partCost = parseInt(part.dataset.cost, 10);

          if (addedParts[partType]) {
            const index = addedParts[partType].findIndex(item => item.dataset.size === part.dataset.size);
            if (index > -1) {
              addedParts[partType].splice(index, 1);
            }

            removedCost += partCost;

            if (addedParts[partType].length === 0) {
              delete addedParts[partType];
            }
          }

          part.remove();
        });

        updateCost(-removedCost);
      }
    });
  });

  observer.observe(appElement, {
    attributes: true,
    attributeFilter: ["data-mode"],
  });
}

removePartsOnModeChange(appElement);
initialize();
