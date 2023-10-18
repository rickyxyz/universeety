import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  Libraries,
  InfoWindowF,
  MarkerClustererF,
  MarkerClusterer,
} from "@react-google-maps/api";
import { FilterType, UniversityType } from "./Types";
import { InfoCard } from "./components/InfoCard";
import { provinces } from "./Data";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const libraries: Libraries = ["places"];

interface MapPropType {
  universities: UniversityType[];
  filters: FilterType;
  viewMode: string;
  onClick?: () => void;
}

const icons = {
  name: "/building.svg",
  address: "/location.svg",
  course: "/book.svg",
};

export default function Map({
  universities,
  filters,
  viewMode,
  onClick,
}: MapPropType) {
  const [markers, setMarkers] = useState<UniversityType[]>([]);
  const mapRef = useRef<google.maps.Map | null>();
  const [selectedMarker, setSelectedMarker] = useState<UniversityType | null>(
    null
  );

  useEffect(() => {
    let filteredUniversities: UniversityType[] = universities;
    for (const type in filters) {
      if (!filters[type as keyof FilterType]) {
        filteredUniversities = filteredUniversities.filter(
          (university) => university.match_type !== type
        );
      }
    }
    setMarkers(filteredUniversities);
  }, [filters, universities]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const center = useMemo<google.maps.LatLngLiteral>(
    () => ({
      lat: -6.1754,
      lng: 106.8272,
    }),
    []
  );

  const options = useMemo<google.maps.MapOptions>(
    () => ({
      mapId: "c170107c800780e3",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );

  const featureStyle = useMemo(() => {
    const featureStyleOptions: google.maps.FeatureStyleOptions = {
      strokeColor: "#810FCB",
      strokeOpacity: 1.0,
      strokeWeight: 3.0,
      fillColor: "#810FCB",
      fillOpacity: 0.5,
    };
    if (viewMode === "count") {
      return featureStyleOptions;
    }
    return null;
  }, [viewMode]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    const map = mapRef.current;
    const featureLayer = map.getFeatureLayer(
      window.google.maps.FeatureType.ADMINISTRATIVE_AREA_LEVEL_1
    );
    const placeArray = Object.values(provinces);
    featureLayer.style = (options: { feature: { placeId: string } }) => {
      if (placeArray.includes(options.feature.placeId)) {
        return featureStyle;
      }
    };
  }, [featureStyle, isLoaded, viewMode]);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    mapRef.current = map;
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      options={options}
      onClick={() => {
        setSelectedMarker(null);
        if (onClick) {
          onClick();
        }
      }}
    >
      {/* <MarkerClustererF>
        {(clusterer) => ( */}
      <>
        {markers.map((university, index) => (
          <MarkerF
            // clusterer={clusterer}
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
      {/* //   )}
      // </MarkerClustererF> */}
    </GoogleMap>
  ) : (
    <>Loading</>
  );
}
