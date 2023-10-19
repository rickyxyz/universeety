import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  Libraries,
  InfoWindowF,
  MarkerClustererF,
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
  const markers = useMemo(() => {
    let filteredUniversities: UniversityType[] = universities;
    for (const type in filters) {
      if (!filters[type as keyof FilterType]) {
        filteredUniversities = filteredUniversities.filter(
          (university) => university.match_type !== type
        );
      }
    }
    return filteredUniversities;
  }, [filters, universities]);
  const [selectedMarker, setSelectedMarker] = useState<UniversityType | null>(
    null
  );
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

  const featureStyle = useCallback(
    (count: number) => {
      if (viewMode !== "count") return null;
      const featureStyleOptions: google.maps.FeatureStyleOptions = {
        strokeColor: "#0A0A0A",
        strokeOpacity: 1.0,
        strokeWeight: 1.0,
        fillColor: heatMapColorforValue(count),
        fillOpacity: 0.6,
      };
      return featureStyleOptions;
    },
    [viewMode]
  );

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const map = mapRef.current;
    const featureLayer = map.getFeatureLayer(
      window.google.maps.FeatureType.ADMINISTRATIVE_AREA_LEVEL_1
    );
    const placeArray = Object.values(provinces);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    featureLayer.style = (options: { feature: { placeId: string } }) => {
      const placeId = options.feature.placeId;
      if (placeArray.includes(placeId)) {
        const provinceName = getKeyByValue(provinces, placeId) as ProvinceName;
        const count = counters.values[provinceName];
        return featureStyle(
          (count - counters.min) / (counters.max - counters.min)
        );
      }
    };
  }, [counters, featureStyle, isLoaded, markers, viewMode]);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    mapRef.current = map;
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height: "100vh",
      }}
      center={{
        lat: -6.1754,
        lng: 106.8272,
      }}
      zoom={10}
      onLoad={onLoad}
      options={{
        mapId: "c170107c800780e3",
        disableDefaultUI: true,
        clickableIcons: false,
      }}
      onClick={() => {
        setSelectedMarker(null);
        if (onClick) {
          onClick();
        }
      }}
    >
      {viewMode === "default" && (
        <MarkerClustererF>
          {(clusterer) => (
            <>
              {markers.map((university, index) => (
                <MarkerF
                  clusterer={clusterer}
                  key={index}
                  position={{
                    lat: university.latitude,
                    lng: university.longitude,
                  }}
                  icon={icons[university.match_type]}
                  onClick={() => setSelectedMarker(university)}
                />
              ))}
              {selectedMarker && (
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
              )}
            </>
          )}
        </MarkerClustererF>
      )}
    </GoogleMap>
  ) : (
    <>Loading</>
  );
}
