import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  // MarkerClustererF,
  // MarkerClusterer,
  Libraries,
  InfoWindowF,
} from "@react-google-maps/api";
import { UniversityType } from "./Types";

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

  useEffect(() => {
    if (universities.length < 1) return;
    const geocoder = new google.maps.Geocoder();
    const bounds = new google.maps.LatLngBounds();
    universities.forEach((university) => {
      geocoder.geocode(
        { address: `${university.address1} ${university.address2}` },
        (results, status) => {
          if (status == google.maps.GeocoderStatus.OK) {
            console.log(results);
            console.log(
              university.name,
              university.latitude,
              university.longitude,
              results && results[0].geometry.location.lat(),
              results && results[0].geometry.location.lng()
            );
          }
        }
      );

      bounds.extend(
        new google.maps.LatLng(university.latitude, university.longitude)
      );
    });
    mapRef.current?.panToBounds(bounds);
  }, [universities]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.GOOGLE_MAPS_API_KEY,
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
      {universities &&
        universities.map((university, index) => {
          return (
            <MarkerF
              key={index}
              position={{ lat: university.latitude, lng: university.longitude }}
              onClick={() => setSelectedMarker(university)}
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
          <div>{selectedMarker.name}</div>
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
      {/* <CircleF center={center} radius={100} /> */}
    </GoogleMap>
  ) : (
    <>Loading</>
  );
}
