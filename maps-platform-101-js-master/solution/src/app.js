/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Loader } from '@googlemaps/js-api-loader';
import MarkerClusterer from '@google/markerclustererplus';

const apiOptions = {
  apiKey: "AIzaSyB0kxzH8w0xqvc7cyjCH3Fidj9my1UllA4"
}

const loader = new Loader(apiOptions);

loader.load().then(() => {
  console.log('Maps JS API loaded');
  const map = displayMap();
  const markers = addMarkers(map);
  clusterMarkers(map, markers);
});

const locations = [
  { loc: { lat: 65.040262, lng: 25.422504}, name: "stop1" },
  { loc: { lat: 65.037295, lng: 25.423410}, name: "stop2" },
  { loc: { lat: 65.024026, lng: 25.457215}, name: "stop3" },
  { loc: { lat: 65.027500, lng: 25.444295}, name: "stop4" },
  { loc: { lat: 65.021745, lng: 25.440849}, name: "stop5" },
  { loc: { lat: 65.015258, lng: 25.435709}, name: "stop6" },
  { loc: { lat: 65.008751, lng: 25.451523}, name: "stop7" },
  { loc: { lat: 65.013745, lng: 25.459935}, name: "stop8" },
  { loc: { lat: 65.011592, lng: 25.459289}, name: "stop9" },
  { loc: { lat: 65.018684, lng: 25.461587}, name: "stop10" } ]
class user {
  constructor(userType) {
    this.route = [];
    this.userType = userType;
}}
let passenger = 1;
let users = new user(passenger); //later linked to dbg
let circle = null;



function displayMap() {
  const mapOptions = {
    center: { lat: 65.0121, lng: 25.4651 }, 
    zoom: 14,
    mapId: 'map'
  };
  const mapDiv = document.getElementById('map');
  return new google.maps.Map(mapDiv, mapOptions);
}

function addMarkers(map) {
  const markers = [];
  for(let i=0; i<locations.length; i++) {
    const markerOptions = {
      map: map,
      position: locations[i].loc,
      icon: './img/custom_pin.png',
      label: locations[i].name
    }
    let marker = new google.maps.Marker(markerOptions);
    marker.addListener('click', event => {
      const location = { lat: event.latLng.lat(), lng: event.latLng.lng() };
      map.panTo(location);
      if(circle!=null){
        circle.setMap(null);
      }
      circle = drawCircle(map, location);
      var element = document.getElementById("loc");
      element.innerHTML = "You selected " + locations[i].name;
      document.getElementById("add").style.display = "flex";
      var element =document.getElementById("add");
      function clickHandler(event){
        var table = document.getElementById("tab");
        var tr = document.createElement('tr');
        table.appendChild(tr);
        var td = document.createElement('td');
        tr.appendChild(td);
        td.innerHTML = locations[i].name;
    }
      element.removeEventListener('click', clickHandler);
      var new_element = element.cloneNode(true);
      element.parentNode.replaceChild(new_element, element);
      new_element.addEventListener('click', clickHandler);
    });


    markers.push(marker);
  }
  return markers;
}

function clusterMarkers(map, markers) {
  const clustererOptions = { imagePath: './img/m' };
  const markerCluster = new MarkerClusterer(map, markers, clustererOptions);
}

function addStopToRoute(currentUser, markers) {
  markers.map(marker => {
    marker.addListener('click', event => {
      const location = { lat: event.latLng.lat(), lng: event.latLng.lng() };
      currentUser.route.push(location);
    });
  });
}
//
function drawCircle(map, location) {
  const circleOptions = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 1,
    map: map,
    center: location,
    radius: 500
  }
  const circle = new google.maps.Circle(circleOptions);
  return circle;
}

