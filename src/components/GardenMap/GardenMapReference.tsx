import mindHouseMap from '../../assets/garden/mind-house-map.png';
import './GardenMapReference.scss';

/** Original PNG art — clipped to garden area (no bottom text panels) */
const GardenMapReference = () => (
  <div className="garden-map-reference" aria-hidden="true">
    <img
      src={mindHouseMap}
      alt=""
      className="garden-map-reference__image"
      draggable={false}
    />
  </div>
);

export default GardenMapReference;
