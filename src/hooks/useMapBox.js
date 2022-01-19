import mapboxgl from "mapbox-gl";
import { useCallback, useRef, useState } from "react";
import { useEffect } from "react/cjs/react.development";
import { Subject } from 'rxjs'
import { v4 } from "uuid";

mapboxgl.accessToken =
  "pk.eyJ1Ijoib3NjYXIxMjAwMiIsImEiOiJja3lkYzh5aGUwMHB6MnZrMXlqY3Zib2NqIn0.zG8IqXZr-eQUS5XdIdoPmA";

export const useMapBox = (initialPoint, mapaDiv) => {
  const [coords, setCoodrs] = useState(initialPoint);
  const mapa = useRef(null);
  const markers = useRef({});

  //obserbable
  const newMarker = useRef(new Subject());
  const moveMarker = useRef(new Subject());

  const addMarker = useCallback((evt, id) => {
    const { lng, lat } = evt.lngLat || evt;

    const marker = new mapboxgl.Marker();
    marker.id = id ?? v4();
    marker.setLngLat([lng, lat]).addTo(mapa.current).setDraggable(true);

    markers.current[marker.id] = marker;

    if(!id){
      newMarker.current.next({
          id: marker.id,
          lng,
          lat
      })
    }

    marker.on("drag", ({ target }) => {
      const { id } = target;
      const { lng, lat } = target.getLngLat();

      moveMarker.current.next({
          id, lng, lat
      })
    });
  }, []);

  const updatedPosition = useCallback(({id, lng, lat}) => {
    markers.current[id].setLngLat([lng, lat])
  }, [])

  useEffect(() => {
    var map = new mapboxgl.Map({
      container: mapaDiv.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [initialPoint.lng, initialPoint.lat],
      zoom: initialPoint.zoom,
    });

    mapa.current = map;
  }, []);

  //mapa movement
  useEffect(() => {
    mapa.current?.on("move", () => {
      const { lng, lat } = mapa.current.getCenter();

      setCoodrs({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: mapa.current.getZoom().toFixed(2),
      });
    });
  }, []);

  // agregar marcadores
  useEffect(() => {
    mapa.current.on("click", addMarker);
  }, []);

  return {
    coords,
    addMarker,
    updatedPosition,
    newMarker$: newMarker.current,
    moveMarker$: moveMarker.current
  };
};
