import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Libraries,
  InfoWindowF,
} from "@react-google-maps/api";
import {
  MarkerClusterer,
  SuperClusterAlgorithm,
} from "@googlemaps/markerclusterer";
import { UniversityType } from "./Types";
import { InfoCard } from "./components/InfoCard";
import { provinces, ProvinceName, icons } from "./mappings";
import { getKeyByValue } from "./utils";

interface MapPropType {
  universities: UniversityType[];
  viewMode: string;
  containerStyle: React.CSSProperties;
  onClick?: () => void;
}

interface CounterType {
  values: Record<ProvinceName, number>;
  min: number;
  max: number;
}

interface clickedFeatureDataType {
  latLng: google.maps.LatLng;
  name: string;
  count: number;
  place_id: string;
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

function heatMapColorforValue(value: number, max: number) {
  const scaledValue = Math.log(value + 1) / Math.log(max + 1);
  const h = (1 - scaledValue) * 100;
  const s = 100;
  const l = 60;
  return hslToHex(h, s, l);
}

function featureStyle(
  count: number,
  max: number,
  clicked = false,
  hovered = false
) {
  const featureStyleOptions: google.maps.FeatureStyleOptions = {
    strokeColor:
      clicked || hovered ? heatMapColorforValue(count, max) : "#0F0F0F",
    strokeOpacity: 0.9,
    strokeWeight: clicked ? 1.5 : 0.5,
    fillColor: count === 0 ? "#DFDFDF" : heatMapColorforValue(count, max),
    fillOpacity: clicked || hovered ? 0.6 : 0.4,
  };
  return featureStyleOptions;
}

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
  viewMode,
  containerStyle,
  onClick,
}: MapPropType) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });
  const clustererRef = useRef<MarkerClusterer>();
  const mapRef = useRef<google.maps.Map | null>();
  const markerRef = useRef<google.maps.Marker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<UniversityType | null>(
    null
  );
  const [clickedFeatureId, setClickedFeatureId] = useState("");
  const [clickedFeatureData, setClickedFeatureData] =
    useState<clickedFeatureDataType | null>(null);
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);
  const [hoveredFeatureId, setHoveredFeatureId] = useState("");

  const counters = useMemo(() => {
    const counters: CounterType = {
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
      return counters;
    }

    universities.forEach((university) => {
      counters.values[university.province] += 1;
    });
    counters.max = Math.max(...(Object.values(counters.values) as number[]));

    return counters;
  }, [isLoaded, universities]);

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
    if (clustererRef.current) clustererRef.current.clearMarkers();
    const provinceId = Object.values(provinces);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    featureLayer.style = (options: { feature: { placeId: string } }) => {
      const placeId = options.feature.placeId;
      if (provinceId.includes(placeId)) {
        const provinceName = getKeyByValue(provinces, placeId) as ProvinceName;
        const count = counters.values[provinceName];
        return featureStyle(
          count,
          counters.max,
          clickedFeatureId === placeId,
          hoveredFeatureId === placeId
        );
      }
    };

    featureLayer.addListener("click", (e: google.maps.FeatureMouseEvent) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const place_id: string = e.features[0].i;
      setClickedFeatureData({
        latLng: e.latLng as google.maps.LatLng,
        place_id: place_id,
        name: getKeyByValue(provinces, place_id) as string,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        count: counters.values[getKeyByValue(provinces, place_id)],
      });
      setIsInfoWindowOpen(true);
      setClickedFeatureId((prev) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return prev == e.features[0].i ? "" : e.features[0].i;
      });
    });

    featureLayer.addListener(
      "mousemove",
      (e: google.maps.FeatureMouseEvent) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const place_id: string = e.features[0].i;
        if (e.features) {
          setHoveredFeatureId(place_id);
        }
      }
    );
  }, [
    clearMarkers,
    clickedFeatureId,
    counters,
    hoveredFeatureId,
    isLoaded,
    universities,
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

  const infoRegion = useMemo(() => {
    if (isInfoWindowOpen && clickedFeatureData) {
      return (
        <InfoWindowF
          position={clickedFeatureData.latLng}
          onCloseClick={() => setIsInfoWindowOpen(false)}
        >
          <div>
            <h4>{clickedFeatureData.name}</h4>
            <p>University count matching: {clickedFeatureData.count}</p>
          </div>
        </InfoWindowF>
      );
    }
    return null;
  }, [clickedFeatureData, isInfoWindowOpen]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || viewMode !== "default") return;
    if (clustererRef.current) clustererRef.current.clearMarkers();
    const map = mapRef.current;
    clearMarkers();

    universities.forEach((university) => {
      const newMarker = new google.maps.Marker({
        position: {
          lat: university.latitude,
          lng: university.longitude,
        },
        map: map,
        icon: icons[university.match_type],
      });
      newMarker.addListener("click", () => setSelectedMarker(university));
      markerRef.current.push(newMarker);
    });

    const clusterer = new MarkerClusterer({
      markers: markerRef.current,
      map,
      algorithm: new SuperClusterAlgorithm({ radius: 200 }),
    });
    clustererRef.current = clusterer;
  }, [isLoaded, clearMarkers, viewMode, universities]);

  const map = useMemo(() => {
    return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        options={options}
        onClick={() => {
          setSelectedMarker(null);
          setClickedFeatureId("");
          setClickedFeatureData(null);
          if (onClick) {
            onClick();
          }
        }}
        onMouseMove={() => {
          setHoveredFeatureId("");
        }}
      >
        {infoUniversity}
        {infoRegion}
      </GoogleMap>
    );
  }, [containerStyle, infoRegion, infoUniversity, onClick, onLoad]);

  return isLoaded ? map : <>Loading</>;
}
