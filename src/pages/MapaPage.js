import React, { useContext, useRef } from "react";
import { useEffect } from "react/cjs/react.development";
import { SocketContext } from "../context/SocketContext";
import { getMarkers } from "../helpers/getMarkers";
import { useMapBox } from "../hooks/useMapBox";

const initialPoint = {
  lng: -70.7,
  lat: 19.45,
  zoom: 10,
};

export const MapaPage = () => {
  const mapaDiv = useRef(null);
  const {socket} = useContext(SocketContext)
  const { coords, addMarker, updatedPosition, newMarker$, moveMarker$ } = useMapBox(initialPoint, mapaDiv);

  // Cargar todos los marcadores
  useEffect(() => {
    getMarkers("markers").then(({data}) => {
      for(let key of Object.keys(data)){
        addMarker(data[key], key)
      }
    })
  }, [])

  // Pintar un nuevo marcodor externo
  useEffect(() => {
    socket.on("new-marker", (marker) => {
      addMarker(marker, marker.id)
    })
  }, [socket])

  // actualizar posicion de un nuevo marcodor externo
  useEffect(() => {
    socket.on("update-marker", (marker) => {
      updatedPosition(marker)
    })
  }, [socket])

  // Emitir un nuevo marcador
  useEffect(() => {
      newMarker$.subscribe((marker) => {
          socket.emit("new-marker", marker)
      })
  }, [newMarker$]);

  // Emitir nueva posicion de marcador
  useEffect(() => {
    moveMarker$.subscribe((marker) => {
        socket.emit("update-marker", marker)
    })
  }, [moveMarker$])

  return (
    <>
      <div className="coords">
        lng: {coords.lng} || lat: {coords.lat} || zoom: {coords.zoom}
      </div>
      <div className="mapContainer" ref={mapaDiv}></div>
    </>
  );
};
