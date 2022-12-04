import * as tt from "@tomtom-international/web-sdk-maps";

export const createMarker = (map, icon, position, color, popupText) => {
  const markerElement = document.createElement("div");
  markerElement.className = "marker";

  const markerContentElement = document.createElement("div");
  markerContentElement.className = "marker-content";
  markerContentElement.style.backgroundColor = color;
  markerElement.appendChild(markerContentElement);

  const iconElement = document.createElement("div");
  iconElement.className = "marker-icon";
  const url =
    "https://www.google.com/url?sa=i&url=https%3A%2F%2Fbranditechture.agency%2Fbrand-logos%2Fdownload%2Femory-eagles%2F&psig=AOvVaw3UODvi9nt6vyr4gv0MzPfV&ust=1670260195290000&source=images&cd=vfe&ved=0CA8QjRxqFwoTCLCu9p664PsCFQAAAAAdAAAAABAF";
  iconElement.style.backgroundImage = url + icon + ")";
  markerContentElement.appendChild(iconElement);

  const popup = new tt.Popup({ offset: 30 }).setText(popupText);
  // add marker to map
  new tt.Marker({ element: markerElement, anchor: "bottom" })
    .setLngLat(position)
    .setPopup(popup)
    .addTo(map);
};
