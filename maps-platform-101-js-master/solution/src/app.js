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
  apiKey: 
}

function initJS(event){
  const loader = new Loader(apiOptions);
  loader.load().then(() => {
    console.log('Maps JS API loaded');
    const map = displayMap();
    const markers = addMarkers(map);
    clusterMarkers(map, markers);
  });
  document.getElementById("book").addEventListener("click", updateHiddenP );
  document.getElementById("offer").addEventListener("click", updateHiddenC);
  document.getElementById("clear").addEventListener("click", clearContent);
  document.getElementById("addTrip").addEventListener("click", addTrip); 
  document.getElementById("offer").disabled = true;
  document.getElementById("book").disabled = true;
}
document.addEventListener("DOMContentLoaded", initJS);

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
  constructor(userType, count) {
    this.route = [];
    this.userType = userType;
    this.count= 0;
  }
  addWayPoint(wayPoint){ 
    for(var i=0; i< this.route.length; i++){
      if(this.route[i].name == wayPoint.name){
       alert("Already added!");
       return;
      }
      if (this.route.length > 5){
        alert("Ops! You reached the maximum number of stops, please make sure you have included your final destination!");
        return;
      }
    }
    this.route.push(wayPoint);
  }
  removeWayPoint(wayPointName){
     for(var i=0; i< this.route.length; i++){
       if(this.route[i].name == wayPointName){
         this.route.splice(i, 1);
         break;
       }
    } 
  }
}
let passenger = 1;
let users = new user(passenger); //later linked to dbg
let circle = null;

function updateHiddenP(event){
  document.getElementById("hidden").style.display = 'block';
  document.getElementById("passengers").style.display = 'flex';
  document.getElementById("captains").style.display = 'none';
  document.getElementById("box").style.display = 'none';
  document.getElementById("buttons").style.display = 'none';
  document.getElementById("tab").style.display = 'none';
}
  
function updateHiddenC(event){ 
  document.getElementById("hidden").style.display = 'block';
  document.getElementById("captains").style.display = 'flex';
  document.getElementById("passengers").style.display = 'none';
  document.getElementById("box").style.display = 'none';
  document.getElementById("buttons").style.display = 'none';
  document.getElementById("tab").style.display = 'none';
}
function clearContent (event){ 
  document.getElementById("hidden").style.display = 'none';
  document.getElementById("box").style.display = 'flex';
  document.getElementById("buttons").style.display = 'flex';
  document.getElementById("tab").style.display = 'flex';
}
function addTrip () {
  reload();
}

function displayMap() {
  const mapOptions = {
    center: { lat: 65.0121, lng: 25.4651 }, 
    zoom: 14,
    mapId: 'map'
  };
  const mapDiv = document.getElementById('map');
  return new google.maps.Map(mapDiv, mapOptions);
}
   
function eventAddWpListener(el, wpIdx){
  el.addEventListener('click', event => { 
    users.addWayPoint(locations[wpIdx]);
    drawTable();  
  });
}

function eventAddRemWpListener(el, rtIdx){
  el.addEventListener('click', event => { 
    users.removeWayPoint( users.route[rtIdx].name ); 
    drawTable(); 
  });
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
      element.innerHTML = "You selected " + locations[i].name + "; Please add at least 2 stops and maximum 6 stops";
        
      var addbtn =document.getElementById("add");
      addbtn.style.display = "flex";
      var new_element = addbtn.cloneNode(true);
      addbtn.parentNode.replaceChild(new_element, addbtn);
      eventAddWpListener(new_element, i);
    });
  
 
    markers.push(marker);
  }
  return markers;
}

function drawTable (){
  var tab = document.getElementById("tab");
  var table = document.getElementById("tabb");
  if(table){
    table.parentNode.removeChild(table);
  }
  table = document.createElement('table');
  table.setAttribute("id","tabb");
  tab.appendChild(table);
  
  for(var i=0; i<users.route.length; i++){
    var tr = document.createElement('tr');
    tr.setAttribute("id", users.route[i].name);
    table.appendChild(tr);
    var td = document.createElement('td');
    td.setAttribute("id","td0");
    var td1 = document.createElement('td');
    td1.setAttribute("id","td1");
    tr.appendChild(td);
    tr.appendChild(td1);
    let btn = document.createElement("button");
    btn.setAttribute("id","clearbtn");
    td1.appendChild(btn);
    btn.innerHTML = "x";
    td.innerHTML = users.route[i].name;
    eventAddRemWpListener(btn, i)
  }
  var dis = (users.route.length < 2) ? true : false;
  document.getElementById("offer").disabled = dis;
  document.getElementById("book").disabled = dis;  
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




