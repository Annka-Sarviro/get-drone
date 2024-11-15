export function updateColors(appElement, MODE) {
  const parts = appElement.querySelectorAll(".main-part");

  const rootStyles = getComputedStyle(document.documentElement);
  const yellowColor = rootStyles.getPropertyValue("--secondary-yellow");
  const blueColor = rootStyles.getPropertyValue("--primary-blue");
  const greyColor = rootStyles.getPropertyValue("--grey");
  const whiteColor = rootStyles.getPropertyValue("--white");

  parts.forEach(item => {
    const type = item.getAttribute("data-type");
    const size = item.getAttribute("data-size");

    item.draggable = MODE === `type-${size}`;

    if (item.draggable) {
      item.style.backgroundColor = whiteColor;
      item.style.outline = "";
    } else {
      item.style.backgroundColor = greyColor;
      item.style.outline = greyColor;
    }

    if (MODE === "type-7" && size === "7") {
      item.style.outline = `${yellowColor} solid 3px`;
    } else if (MODE === "type-10" && size === "10") {
      item.style.outline = `${blueColor} solid 3px`;
    }
  });
}
