const customLabel = document.getElementById("customLabel");
const selectedFormat = document.getElementById("selectedFormat");
const selectOptions = document.getElementById("selectOptions");
const arrow = document.querySelector(".arrow");

customLabel.addEventListener("click", () => {
  selectOptions.classList.toggle("show");
  arrow.classList.toggle("rotate");
});

document.querySelectorAll("#selectOptions li").forEach(option => {
  option.addEventListener("click", function () {
    selectedFormat.textContent = this.getAttribute("data-value");
    arrow.classList.remove("rotate");
  });
});

document.addEventListener("click", function (event) {
  if (!customLabel.contains(event.target)) {
    arrow.classList.remove("rotate");
    selectOptions.classList.remove("show");
  }
});
