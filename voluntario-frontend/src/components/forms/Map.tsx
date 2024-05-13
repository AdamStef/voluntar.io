import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMapEvents } from 'react-leaflet/hooks';
import 'leaflet/dist/leaflet.css';

function LocationMarker() {
  const [position, setPosition] = useState({ lat: 52, lng: 20 });
  const map = useMapEvents({
    click() {
      map.locate();
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

function Map() {
  return (
    <div>
      <h2>Mapa</h2>
      <MapContainer
        center={{ lat: 51.505, lng: -0.09 }}
        zoom={21}
        scrollWheelZoom={false}
      >
        <>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </>
        <LocationMarker />
      </MapContainer>
    </div>
  );
}

export default Map;
