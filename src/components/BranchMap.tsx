import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L, { divIcon, Map as LeafletMap, Marker as LeafletMarker } from "leaflet";

export type BranchMapBranch = {
  id: string;
  name: string;
  addressLine?: string;
  lat?: number;
  lon?: number;
};

const makeSvgPin = () =>
  divIcon({
    className: "",
    iconSize: [28, 40],
    iconAnchor: [14, 36],
    popupAnchor: [0, -32],
    html: `
      <svg width="28" height="40" viewBox="0 0 28 40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Map pin">
        <defs>
          <filter id="s" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000" flood-opacity="0.35"/>
          </filter>
        </defs>
        <g filter="url(#s)">
          <path d="M14 1c-6.075 0-11 4.925-11 11 0 7.5 11 20 11 20s11-12.5 11-20c0-6.075-4.925-11-11-11z" fill="#e03131" stroke="white" stroke-width="2"/>
          <circle cx="14" cy="12" r="5" fill="white" opacity="0.9"/>
        </g>
      </svg>
    `,
  });

const branchIcon = makeSvgPin();

export default function BranchMap({
  branch,
  height = 420,
  width = "100%",
  zoom = 15,
}: {
  branch: BranchMapBranch;
  height?: number;
  width?: number | string;
  zoom?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);

  const hasCoords =
    typeof branch?.lat === "number" && typeof branch?.lon === "number";

  const center: [number, number] = hasCoords
    ? [branch.lat!, branch.lon!]
    : [51.5074, -0.1278];

  // Initialize the map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom,
      scrollWheelZoom: true,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Update view and marker when branch/zoom changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.setView(center, zoom, { animate: false });

    if (hasCoords) {
      if (markerRef.current) {
        markerRef.current.setLatLng([branch.lat!, branch.lon!]);
      } else {
        markerRef.current = L.marker([branch.lat!, branch.lon!], {
          icon: branchIcon,
          zIndexOffset: 1000,
        })
          .addTo(map)
          .bindPopup(`<b>${branch.name}</b><br/>${branch.addressLine ?? ""}`);
      }
    } else if (markerRef.current) {
      map.removeLayer(markerRef.current);
      markerRef.current = null;
    }
  }, [branch.id, branch.lat, branch.lon, branch.name, branch.addressLine, zoom]);

  return (
    <div
      ref={containerRef}
      style={{ height: `${height}px`, width }}
      role="region"
      aria-label="Branch location map"
    />
  );
}
 