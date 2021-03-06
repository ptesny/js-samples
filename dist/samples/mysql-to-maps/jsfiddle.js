const customLabel = {
  restaurant: {
    label: "R",
  },
  bar: {
    label: "B",
  },
};

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: new google.maps.LatLng(-33.863276, 151.207977),
    zoom: 12,
  });
  const infoWindow = new google.maps.InfoWindow();
  // Change this depending on the name of your PHP or XML file
  downloadUrl(
    "https://storage.googleapis.com/mapsdevsite/json/mapmarkers2.xml",
    (data) => {
      const xml = data.responseXML;
      const markers = xml.documentElement.getElementsByTagName("marker");
      Array.prototype.forEach.call(markers, (markerElem) => {
        const id = markerElem.getAttribute("id");
        const name = markerElem.getAttribute("name");
        const address = markerElem.getAttribute("address");
        const type = markerElem.getAttribute("type");
        const point = new google.maps.LatLng(
          parseFloat(markerElem.getAttribute("lat")),
          parseFloat(markerElem.getAttribute("lng"))
        );
        const infowincontent = document.createElement("div");
        const strong = document.createElement("strong");
        strong.textContent = name;
        infowincontent.appendChild(strong);
        infowincontent.appendChild(document.createElement("br"));
        const text = document.createElement("text");
        text.textContent = address;
        infowincontent.appendChild(text);
        const icon = customLabel[type] || {};
        const marker = new google.maps.Marker({
          map,
          position: point,
          label: icon.label,
        });
        marker.addListener("click", () => {
          infoWindow.setContent(infowincontent);
          infoWindow.open(map, marker);
        });
      });
    }
  );
}

function downloadUrl(url, callback) {
  const request = window.ActiveXObject
    ? new ActiveXObject("Microsoft.XMLHTTP")
    : new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      request.onreadystatechange = doNothing;
      callback(request);
    }
  };
  request.open("GET", url, true);
  request.send(null);
}

function doNothing() {}
