import React, { useEffect, useRef } from 'react';
import ca from './../geojson/ca.json';
import md from './../geojson/md.json';
import ny from './../geojson/ny.json';
import nv from './../geojson/nv.json';
import pa from './../geojson/pa.json';
import sc from './../geojson/sc.json';
import dc from './../geojson/dc.json';
import va from './../geojson/va.json';
import jp from './../geojson/japan.json';
import aus from './../geojson/australia.json';
import thai from './../geojson/thailand.json';
import vn from './../geojson/vietnam.json';
import cambodia from './../geojson/cambodia.json';
import malaysia from './../geojson/malaysia.json';
import uae from './../geojson/uae.json';
import singapore from './../geojson/singapore.json';
import ontario from './../geojson/ontario.json';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const locationData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Leidos, Alexandria, VA",
        "job": "Web Developer Intern",
        "Date": "June 2024 - Present"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-77.15580322904877, 38.76848748003718]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "George Mason University, Fairfax, VA",
        "job": "Information Technology Assistant",
        "Date": "February 2023 - June 2024"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-77.3050512423611, 38.82839021202259]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "George Mason University, Fairfax, VA",
        "job": "Teaching Assistant",
        "Date": "January 2023 - Present"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-77.30763518780114, 38.831182984443316]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Designer Shoe Warehouse, Fairfax, VA",
        "job": "Sales Associate",
        "Date": "June 2022 - February 2023"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-77.39127942908372, 38.86130647683784]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Five Guys, Centreville, VA",
        "job": "Cashier/Cook",
        "Date": "May 2021 - August 2021"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-77.43377141830706, 38.83797851864241]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Popeyes, Clifton , VA",
        "job": "Cashier/Cook",
        "Date": "June 2020 - January 2021"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-77.412754512811, 38.83407122718696]
      }
    }
  ]
};

const regionData = [
  { name: "Ontario", color: "blue", geojson: ontario },
  { name: "California", color: "red", geojson: ca },
  { name: "Maryland", color: "#8d5524", geojson: md },
  { name: "New York", color: "purple", geojson: ny },
  { name: "Nevada", color: "green", geojson: nv },
  { name: "Pennsylvania", color: "orange", geojson: pa },
  { name: "South Carolina", color: "#FF6347", geojson: sc },
  { name: "Washington DC", color: "#4B0082", geojson: dc },
  { name: "Virginia", color: "#20B2AA", geojson: va },
  { name: "Japan", color: "#FFD700", geojson: jp },
  { name: "Australia", color: "#FF4500", geojson: aus },
  { name: "Thailand", color: "#FF69B4", geojson: thai },
  { name: "Vietnam", color: "#FF1493", geojson: vn },
  { name: "Cambodia", color: "#FF00FF", geojson: cambodia },
  { name: "Malaysia", color: "#FF00FF", geojson: malaysia },
  { name: "UAE", color: "#FF00FF", geojson: uae },
  { name: "Singapore", color: "red", geojson: singapore }

];

const locationIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
});

const createPopupContent = (feature) => `
  <h5>${feature.properties.name}</h5>
  Job: ${feature.properties.job} <br>
  Date: ${feature.properties.Date}
`;
export const Map = () => {
  const mapRef = useRef(null);
  const geojsonLayers = useRef([]); // Store geoJSON layers here

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: [38.820483, -77.226487],
      zoom: 3,
      minZoom: 3,
      worldCopyJump: true,
      maxBounds: [[-90, -Infinity], [90, Infinity]],
    });
    const osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    });

    const esriLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    });

    var NASAGIBS_ViirsEarthAtNight2012 = L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
      minZoom: 1,
      maxZoom: 8,
      format: 'jpg',
      time: '',
      tilematrixset: 'GoogleMapsCompatible_Level'
    });

    var Stadia_StamenTonerLite = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.{ext}', {
      minZoom: 0,
      maxZoom: 20,
      ext: 'png'
    });


    osmLayer.addTo(map); // Add the layer to the map by default

    const baseMaps = { // Base maps to choose from
      "OpenStreetMap": osmLayer,
      "Esri World Imagery": esriLayer,
      "NASA Night": NASAGIBS_ViirsEarthAtNight2012,
      "Stadia Toner Lite": Stadia_StamenTonerLite
    };


    const jobHistoryLayer = L.layerGroup();
    const visitedLayer = L.layerGroup();

    // Add job history markers
    locationData.features.forEach((feature) => {
      const marker = L.marker(
        [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
        { icon: locationIcon }
      )
        .bindPopup(createPopupContent(feature))
        .on('mouseover', function () { this.openPopup(); })
        .on('mouseout', function () { this.closePopup(); });

      jobHistoryLayer.addLayer(marker);
    });

    // Interaction functions when hovering over regions
    function highlightFeature(e) {
      const layer = e.target;
      layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
      });
      layer.bringToFront();
    }

    // Reset the style when not hovering over the region
    function resetHighlight(e) {
      const layer = e.target;
      geojsonLayers.current.forEach((geojsonLayer) => {
        geojsonLayer.resetStyle(layer);
      });
    }

    // Zoom to the region when clicked
    function zoomToFeature(e) {
      map.fitBounds(e.target.getBounds());
    }

    function showPopup(e) {
      const layer = e.target;
      const info = layer.feature.properties.message || "Unknown";

      L.popup()
        .setLatLng(e.latlng)
        .setContent(`<p>${info}</p>`)
        .openOn(map);
    }

    // Add interaction to the region layers
    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: (e) => {
          zoomToFeature(e);
          showPopup(e);
        }
      });
    }

    // Add region layers with interaction
    regionData.forEach((region) => {
      if (region.geojson) {
        const geojsonLayer = L.geoJSON(region.geojson, {
          style: {
            color: region.color,
            weight: 2,
            opacity: 1,
            dashArray: '3'
          },
          onEachFeature: onEachFeature  // Add interaction
        });

        geojsonLayers.current.push(geojsonLayer); // Store the layer
        geojsonLayer.addTo(visitedLayer);
      }
    });

    jobHistoryLayer.addTo(map);
    visitedLayer.addTo(map);

    const overlayMaps = {
      "Job History": jobHistoryLayer,
      "Visited": visitedLayer
    };

    L.control.layers(baseMaps, overlayMaps, { collapsed: true }).addTo(map);


    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="h-full w-full border-style">
      <div ref={mapRef} className="h-full" />
    </div>
  );
};

