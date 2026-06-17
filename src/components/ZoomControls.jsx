import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

function ZoomControls() {
  const map = useMap();
  const controlRef = useRef(null);

  useEffect(() => {
    if (controlRef.current) {
      window.L.DomEvent.disableClickPropagation(controlRef.current);
      window.L.DomEvent.disableScrollPropagation(controlRef.current);
    }
  }, []);

  return (
    <div className="custom-zoom" ref={controlRef}>
      <button
        type="button"
        onClick={() => map.setZoom(Math.min(map.getZoom() + 1, 18))}
      >
        +
      </button>

      <button
        type="button"
        onClick={() => map.setZoom(Math.max(map.getZoom() - 1, 12))}
      >
        −
      </button>
    </div>
  );
}

export default ZoomControls;
