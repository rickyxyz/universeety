import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  Libraries,
  InfoWindowF,
} from "@react-google-maps/api";
import { UniversityType } from "./Types";
import { InfoCard } from "./components/InfoCard";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const libraries: Libraries = ["places"];

interface MapPropType {
  universities: UniversityType[];
}

export default function Map({ universities }: MapPropType) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<UniversityType | null>(
    null
  );
  const [markers, setMarkers] = useState<UniversityType[]>([]);

  useEffect(() => {
    setMarkers([]);
    if (universities.length < 1) return;
    const geocoder = new google.maps.Geocoder();
    universities.forEach((university) => {
      if (university.latitude == 0 && university.longitude == 0) {
        geocoder.geocode(
          { address: `${university.address1} ${university.address2}` },
          (results, status) => {
            if (status == google.maps.GeocoderStatus.OK && results) {
              setMarkers((prev) => [
                ...prev,
                {
                  ...university,
                  latitude: results[0].geometry.location.lat(),
                  longitude: results[0].geometry.location.lng(),
                },
              ]);
            }
          }
        );
      } else {
        setMarkers((prev) => [...prev, university]);
      }
    });
  }, [universities]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const center = useMemo<google.maps.LatLngLiteral>(
    () => ({
      lat: -6.1754,
      lng: 106.8272,
    }),
    []
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const options = useMemo<google.maps.MapOptions>(
    () => ({
      mapId: "c170107c800780e3",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );

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
    >
      {markers &&
        markers.map((marker, index) => {
          return (
            <MarkerF
              key={index}
              position={{ lat: marker.latitude, lng: marker.longitude }}
              onClick={() => setSelectedMarker(marker)}
            />
          );
        })}
      {selectedMarker && (
        <InfoWindowF
          options={{
            pixelOffset: new window.google.maps.Size(0, -40),
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
      {/* <MarkerClusterer>
        {(clusterer) => (
          <>
            {markers.map((marker, index) => (
              <MarkerF key={index} position={marker} clusterer={clusterer} />
            ))}
          </>
        )}
      </MarkerClusterer> */}
    </GoogleMap>
  ) : (
    <>Loading</>
  );
}
