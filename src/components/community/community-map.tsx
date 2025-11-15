"use client";

import Map, { Marker, NavigationControl, ViewState } from "react-map-gl";
import { useMemo, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";
import { CommunityInput } from "@/lib/types";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function CommunityMap({ inputs }: { inputs: CommunityInput[] }) {
  const initialView = useMemo(
    () =>
      ({
        longitude: inputs[0]?.longitude ?? -119.4179,
        latitude: inputs[0]?.latitude ?? 36.7783,
        zoom: 5.5,
        bearing: 0,
        pitch: 0,
        padding: { top: 0, bottom: 0, left: 0, right: 0 },
      }) satisfies ViewState,
    [inputs],
  );
  const [viewState, setViewState] = useState(initialView);

  if (!MAPBOX_TOKEN) {
    return <p className="text-sm text-muted-foreground">Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to enable the map.</p>;
  }

  return (
    <Map
      mapboxAccessToken={MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/light-v11"
      {...viewState}
      onMove={(event) => setViewState(event.viewState)}
    >
      <NavigationControl position="top-right" />
      {inputs
        .filter((input) => input.latitude && input.longitude)
        .map((input) => (
          <Marker key={input.id} latitude={input.latitude!} longitude={input.longitude!} anchor="bottom">
            <MapPin className="h-6 w-6 text-primary" />
          </Marker>
        ))}
    </Map>
  );
}

