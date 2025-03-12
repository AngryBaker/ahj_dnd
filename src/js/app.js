document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".add-card").forEach((button) => {
    button.addEventListener("click", () => {
      showAddCardForm(button);
    });
  });
});

function showAddCardForm(button) {
  button.style.display = "none";

  const form = document.createElement("div");
  form.className = "card-form";

  const input = document.createElement("textarea");
  input.className = "new-card-input";
  input.placeholder = "Enter a title for this card…";

  const addButton = document.createElement("button");
  addButton.className = "add-card-btn";
  addButton.textContent = "Add Card";

  const cancelButton = document.createElement("button");
  cancelButton.className = "cancel-card-btn";
  cancelButton.textContent = "✖";

  addButton.addEventListener("click", () => {
    if (input.value.trim() !== "") {
      createNewCard(input, button);
    }
  });

  cancelButton.addEventListener("click", () => {
    form.remove();
    button.style.display = "block";
  });

  form.appendChild(input);
  form.appendChild(addButton);
  form.appendChild(cancelButton);

  button.parentElement.appendChild(form);
  input.focus();
}

function createNewCard(input, button) {
  const card = document.createElement("li");
  card.className = "card";
  card.innerHTML = `<div class="close"></div> ${input.value}`;

  input.parentElement.parentElement
    .querySelector(".cards-list")
    .appendChild(card);
  input.parentElement.remove();

  button.style.display = "block";
}
const container = document.querySelector(".container");

container.addEventListener("click", (e) => {
  if (e.target.classList.contains("close")) {
    console.log("crestic");
    const cardForDelete = e.target.parentElement;
    cardForDelete.remove();
  }
});

let actualElement;
let startList;
let actElemInfo = {};
let startPlaceholder = document.createElement("div");
startPlaceholder.className = "placeholder";

let targetPlaceholder = document.createElement("div");
targetPlaceholder.className = "placeholder";

const onMouseUp = (e) => {
  if (!actualElement) return;

  targetPlaceholder.replaceWith(actualElement);

  startPlaceholder.remove();
  actualElement.classList.remove("dragged");
  actualElement.removeAttribute("style");
  actualElement = undefined;
  startList = undefined;
  document.body.classList.remove("grab");

  document.documentElement.removeEventListener("mouseup", onMouseUp);
  document.documentElement.removeEventListener("mousemove", onMouseMove);
};

const onMouseMove = (e) => {
  if (!actualElement) return;

  actualElement.style.top = e.clientY - actElemInfo.yDiff + "px";
  actualElement.style.left = e.clientX - actElemInfo.xDiff + "px";

  const currentList = document
    .elementFromPoint(e.clientX, e.clientY)
    ?.closest(".cards-list");
  if (!currentList) return;

  let closestCard = [
    ...currentList.querySelectorAll(".card:not(.dragged)"),
  ].find(
    (card) =>
      e.clientY < card.getBoundingClientRect().top + card.offsetHeight / 2,
  );

  if (closestCard) {
    currentList.insertBefore(targetPlaceholder, closestCard);
  } else {
    currentList.appendChild(targetPlaceholder);
  }
};

container.addEventListener("mousedown", (e) => {
  if (!e.target.classList.contains("card")) return;
  e.preventDefault();
  actualElement = e.target;
  const actElemCoords = actualElement.getBoundingClientRect();

  actElemInfo.xDiff = e.clientX - actElemCoords.x;
  actElemInfo.yDiff = e.clientY - actElemCoords.y;

  startList = actualElement.parentElement;

  startPlaceholder.style.width = `${actElemCoords.width}px`;
  startPlaceholder.style.height = `${actElemCoords.height}px`;

  targetPlaceholder.style.width = `${actElemCoords.width}px`;
  targetPlaceholder.style.height = `${actElemCoords.height}px`;

  actualElement.classList.add("dragged");
  document.body.classList.add("grab");

  startList.insertBefore(startPlaceholder, actualElement);

  document.documentElement.addEventListener("mouseup", onMouseUp);
  document.documentElement.addEventListener("mousemove", onMouseMove);
});
