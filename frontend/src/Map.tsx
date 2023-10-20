import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Libraries,
  InfoWindowF,
} from "@react-google-maps/api";
import { FilterType, UniversityType } from "./Types";
import { InfoCard } from "./components/InfoCard";
import { provinces, ProvinceName, icons } from "./mappings";
import { getKeyByValue } from "./utils";

interface MapPropType {
  universities: UniversityType[];
  filters: FilterType;
  viewMode: string;
  onClick?: () => void;
}

interface CounterType {
  values: Record<ProvinceName, number>;
  min: number;
  max: number;
}

const libraries: Libraries = ["places"];

function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function heatMapColorforValue(value: number) {
  const h = (1 - value) * 120;
  const s = 100;
  const l = 60;
  return hslToHex(h, s, l);
}

function featureStyle(count: number, clicked = false, hovered = false) {
  const featureStyleOptions: google.maps.FeatureStyleOptions = {
    strokeColor: clicked || hovered ? heatMapColorforValue(count) : "#0F0F0F",
    strokeOpacity: 0.9,
    strokeWeight: clicked ? 1.5 : 0.5,
    fillColor: heatMapColorforValue(count),
    fillOpacity: clicked || hovered ? 0.6 : 0.4,
  };
  return featureStyleOptions;
}

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: -6.1754,
  lng: 106.8272,
};

const options = {
  mapId: "c170107c800780e3",
  disableDefaultUI: true,
  clickableIcons: false,
  disableDoubleClickZoom: true,
};

export default function Map({
  universities,
  filters,
  viewMode,
  onClick,
}: MapPropType) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });
  const mapRef = useRef<google.maps.Map | null>();
  const markerRef = useRef<google.maps.Marker[]>([]);
  const markers = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const visibleFilter = Object.keys(filters).filter((key) => filters[key]);
    return universities.filter((university) =>
      visibleFilter.includes(university.match_type)
    );
  }, [filters, universities]);
  const [selectedMarker, setSelectedMarker] = useState<UniversityType | null>(
    null
  );
  const [clickedFeatureId, setClickedFeatureId] = useState("");
  const [hoveredFeatureId, setHoveredFeatureId] = useState("");
  const counters = useMemo(() => {
    const counter: CounterType = {
      values: Object.keys(provinces).reduce(
        (cnt: Record<string, number>, key) => {
          cnt[key] = 0;
          return cnt;
        },
        {}
      ),
      min: 0,
      max: 0,
    };

    if (!isLoaded || !mapRef.current) {
      return counter;
    }

    markers.forEach((marker) => {
      counter.values[marker.province] += 1;
    });
    counter.max = Math.max(...(Object.values(counter.values) as number[]));
    counter.min = Math.min(...(Object.values(counter.values) as number[]));

    return counter;
  }, [isLoaded, markers]);

  const clearMarkers = useCallback(() => {
    while (markerRef.current.length) {
      markerRef.current.pop()?.setMap(null);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const map = mapRef.current;
    const featureLayer = map.getFeatureLayer(
      window.google.maps.FeatureType.ADMINISTRATIVE_AREA_LEVEL_1
    );

    if (viewMode !== "count") {
      featureLayer.style = null;
      return;
    }

    clearMarkers();
    const provinceId = Object.values(provinces);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    featureLayer.style = (options: { feature: { placeId: string } }) => {
      const placeId = options.feature.placeId;
      if (provinceId.includes(placeId)) {
        const provinceName = getKeyByValue(provinces, placeId) as ProvinceName;
        const count = counters.values[provinceName];
        return featureStyle(
          (count - counters.min) / (counters.max - counters.min),
          clickedFeatureId === placeId,
          hoveredFeatureId === placeId
        );
      }
    };

    featureLayer.addListener("click", (e: google.maps.FeatureMouseEvent) => {
      setClickedFeatureId((prev) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return prev == e.features[0].i ? "" : e.features[0].i;
      });
    });

    featureLayer.addListener(
      "mousemove",
      (e: google.maps.FeatureMouseEvent) => {
        if (e.features) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          setHoveredFeatureId(e.features[0].i);
        }
      }
    );
  }, [
    clearMarkers,
    clickedFeatureId,
    counters,
    hoveredFeatureId,
    isLoaded,
    markers,
    viewMode,
  ]);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    mapRef.current = map;
  }, []);

  const infoUniversity = useMemo(() => {
    return (
      selectedMarker && (
        <InfoWindowF
          options={{
            pixelOffset: new window.google.maps.Size(0, -20),
          }}
          position={{
            lat: selectedMarker.latitude,
            lng: selectedMarker.longitude,
          }}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <InfoCard university={selectedMarker} />
        </InfoWindowF>
      )
    );
  }, [selectedMarker]);

  useEffect(() => {
    if (isLoaded && mapRef.current && viewMode === "default") {
      const map = mapRef.current;
      clearMarkers();

      markers.forEach((marker) => {
        const newMarker = new google.maps.Marker({
          position: {
            lat: marker.latitude,
            lng: marker.longitude,
          },
          map: map,
          icon: icons[marker.match_type],
        });
        newMarker.addListener("click", () => setSelectedMarker(marker));
        markerRef.current.push(newMarker);
      });
    }
  }, [markers, isLoaded, clearMarkers, viewMode]);

  const map = useMemo(() => {
    return (
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        options={options}
        onClick={() => {
          setSelectedMarker(null);
          setClickedFeatureId("");
          if (onClick) {
            onClick();
          }
        }}
        onMouseMove={() => {
          setHoveredFeatureId("");
        }}
      >
        {infoUniversity}
      </GoogleMap>
    );
  }, [infoUniversity, onClick, onLoad]);

  return isLoaded ? map : <>Loading</>;
}
