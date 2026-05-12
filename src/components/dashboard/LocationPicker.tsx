"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet + Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface LocationPickerProps {
  onLocationSelect: (data: { address: string; city: string; zip: string }) => void;
}

function MapEvents({ setPosition, onLocationSelect }: { 
  setPosition: (pos: [number, number]) => void;
  onLocationSelect: LocationPickerProps["onLocationSelect"];
}) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      
      try {
        // Reverse Geocoding using Nominatim (Free)
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        
        if (data && data.address) {
          onLocationSelect({
            address: data.display_name.split(',').slice(0, 2).join(', '),
            city: data.address.city || data.address.town || data.address.village || data.address.suburb || "",
            zip: data.address.postcode || ""
          });
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      }
    },
  });
  return null;
}

function RecenterMap({ position }: { position: [number, number] }) {
  const map = useMapEvents({});
  useEffect(() => {
    map.flyTo(position, 15);
  }, [position, map]);
  return null;
}

export default function LocationPicker({ onLocationSelect }: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number]>([23.8103, 90.4125]); // Default to Dhaka

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data && data.address) {
        onLocationSelect({
          address: data.display_name.split(',').slice(0, 2).join(', '),
          city: data.address.city || data.address.town || data.address.village || data.address.suburb || "",
          zip: data.address.postcode || ""
        });
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        fetchAddress(latitude, longitude); // Auto-fill on load
      });
    }
  }, []);

  return (
    <div className="h-[250px] w-full rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 relative z-0">
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={icon} />
        <RecenterMap position={position} />
        <MapEvents setPosition={setPosition} onLocationSelect={onLocationSelect} />
      </MapContainer>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
        <p className="text-[10px] font-bold text-slate-500">Click on map to pick location</p>
      </div>
    </div>
  );
}

