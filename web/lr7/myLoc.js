let watchId = null;
let map = null;
let destMarker = null;
let destPosition = null;

let ourCoords = {
    latitude: 48.94321,
    longitude: 24.73380
};

document.addEventListener("DOMContentLoaded", getMyLocation);

function getMyLocation() {
    document.getElementById("setDest").onclick = setDestination;
    document.getElementById("goDest").onclick = goToDestination;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(displayLocation, displayError);
        let watchButton = document.getElementById("watch");
        watchButton.onclick = watchLocation;
        let clearWatchButton = document.getElementById("clearWatch");
        clearWatchButton.onclick = clearWatch;
    } else {
        alert("Oops, no geolocation support");
    }
}

function displayLocation(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let div = document.getElementById("location");
    div.innerHTML = `You are at Latitude: ${latitude}, Longitude: ${longitude}`;
    div.innerHTML += ` (with ${position.coords.accuracy} meters accuracy)`;
    let km = computeDistance(position.coords, ourCoords);
    let distance = document.getElementById("distance");
    distance.innerHTML = `You are ${km} km from the College`;

    ensureMap([latitude, longitude]);
    let time = new Date(position.timestamp).toLocaleTimeString();
    L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup(`You are here: ${latitude}, ${longitude}<br>Time: ${time}`);
    map.panTo([latitude, longitude]);
}

function ensureMap(center) {
    if (map) return;
    map = L.map("map").setView(center, 15);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);
}

function readDestination() {
    let lat = parseFloat(document.getElementById("destLat").value.replace(",", "."));
    let lng = parseFloat(document.getElementById("destLng").value.replace(",", "."));
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        alert("Введіть коректні координати (широта −90…90, довгота −180…180)");
        return null;
    }
    return [lat, lng];
}

function setDestination() {
    let latLng = readDestination();
    if (!latLng) return;

    ensureMap(latLng);
    if (destMarker) {
        map.removeLayer(destMarker);
    }
    destPosition = latLng;
    destMarker = L.circleMarker(latLng, {
        radius: 10,
        color: "red",
        fillColor: "red",
        fillOpacity: 0.6
    }).addTo(map).bindPopup(`Destination: ${latLng[0]}, ${latLng[1]}`);
}

function goToDestination() {
    if (!destPosition) {
        setDestination();
        if (!destPosition) return;
    }
    map.flyTo(destPosition, 15);
    destMarker.openPopup();
}

function displayError(error) {
    const errorTypes = {
        0: "Unknown error",
        1: "Permission denied by user",
        2: "Position is not available",
        3: "Request timed out"
    };
    let errorMessage = errorTypes[error.code];
    if (error.code == 0 || error.code == 2) {
        errorMessage = errorMessage + " " + error.message;
    }
    let div = document.getElementById("location");
    div.innerHTML = errorMessage;
}

function computeDistance(startCoords, destCoords) {
    let startLatRads = degreesToRadians(startCoords.latitude);
    let startLongRads = degreesToRadians(startCoords.longitude);
    let destLatRads = degreesToRadians(destCoords.latitude);
    let destLongRads = degreesToRadians(destCoords.longitude);
    let Radius = 6371; // вказаний радіус землі у км

    let distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) +
        Math.cos(startLatRads) * Math.cos(destLatRads) *
        Math.cos(startLongRads - destLongRads)) * Radius;

    return distance;
}

function degreesToRadians(degrees) {
    let radians = (degrees * Math.PI)/180;
    return radians;
}

function watchLocation() {
    watchId = navigator.geolocation.watchPosition(displayLocation, displayError);
}

function clearWatch() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
}