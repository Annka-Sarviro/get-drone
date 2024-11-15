export async function loadPartsData() {
  try {
    const response = await fetch("/data.json");
    const data = await response.json();
    const partsData = await data.parts;
    return partsData;
  } catch (error) {
    return [];
  }
}
