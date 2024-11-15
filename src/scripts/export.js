export function exportConfiguration(addedParts) {
  const parts = formatAddedParts(addedParts);

  if (!addedParts.frame || addedParts.frame.length === 0) {
    alert("Missing part: Frame is required.");
    return;
  }

  if (!addedParts.motor || addedParts.motor.length === 0) {
    alert("Missing part: At least one Motor is required.");
    return;
  }

  if (!addedParts.battery || addedParts.battery.length === 0) {
    alert("Missing part: Battery is required.");
    return;
  }

  if (!addedParts.motor || addedParts.motor.length < 3) {
    alert("Missing part: Battery is required.");
    return;
  }

  const selectedFormatText = document.getElementById("selectedFormat").textContent;
  selectedFormatText === "JSON" ? exportAsJSON(parts) : exportAsCSV(parts);
}

function exportAsJSON(data) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "addedParts.json";
  a.click();

  URL.revokeObjectURL(url);
}

function exportAsCSV(data) {
  const csvRows = [];
  const headers = ["Part Name", "Size", "Cost"];

  csvRows.push(headers.join(","));

  for (const type in data) {
    data[type].forEach(part => {
      const row = [part.name, part.size, part.cost];
      csvRows.push(row.join(","));
    });
  }

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "addedParts.csv";
  a.click();

  URL.revokeObjectURL(url);
}

function formatAddedParts(addedParts) {
  const formattedParts = {};

  Object.keys(addedParts).forEach(key => {
    const partsArray = addedParts[key];

    formattedParts[key] = partsArray.map(part => ({
      name: part.dataset.type,
      size: part.dataset.size,
      cost: parseInt(part.dataset.cost, 10),
    }));
  });

  return formattedParts;
}
