export function setPartsCost(price) {
  const parts = document.querySelectorAll(".part");
  parts.forEach(part => {
    const partType = part.dataset.type;
    const partSize = part.dataset.size;

    const foundPart = price.find(item => {
      return item.type === partType && (item.size === partSize || item.size === "all");
    });

    if (foundPart) {
      part.dataset.cost = foundPart.cost;

      const priceSpan = part.closest(".details-wrapper").querySelector(".price-span");
      if (priceSpan) {
        priceSpan.textContent = foundPart.cost;
      }
    }
  });
}
