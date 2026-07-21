export interface GardenSvgPoint {
  cx: number;
  cy: number;
}

export interface GardenZoneScene {
  id: string;
  marker: GardenSvgPoint;
  accent?: GardenSvgPoint;
}

export interface GardenMarkerPosition {
  x: number;
  y: number;
}

/** SVG viewBox: 0 0 800 520 — garden only, no bottom text panels */
export const GARDEN_MAP_VIEWBOX = { width: 800, height: 520 };

/** Top portion of original PNG — panels excluded */
export const GARDEN_ART_CLIP_RATIO = 0.68;

export const GARDEN_SCENE = {
  center: { cx: 400, cy: 248 },
  gate: { cx: 400, cy: 438 },
  zones: {
    'tu-chiem-nghiem': { id: 'tu-chiem-nghiem', marker: { cx: 118, cy: 108 }, accent: { cx: 108, cy: 148 } },
    'sang-tao': { id: 'sang-tao', marker: { cx: 118, cy: 412 }, accent: { cx: 128, cy: 372 } },
    'ket-noi': { id: 'ket-noi', marker: { cx: 682, cy: 108 }, accent: { cx: 672, cy: 148 } },
    'cam-xuc': { id: 'cam-xuc', marker: { cx: 682, cy: 412 }, accent: { cx: 672, cy: 372 } },
    'tam-tri': { id: 'tam-tri', marker: { cx: 400, cy: 228 } },
    'bo-loc': { id: 'bo-loc', marker: { cx: 400, cy: 418 } },
  } satisfies Record<string, GardenZoneScene>,
} as const;

export const svgPointToPercent = ({ cx, cy }: GardenSvgPoint): GardenMarkerPosition => ({
  x: (cx / GARDEN_MAP_VIEWBOX.width) * 100,
  y: (cy / GARDEN_MAP_VIEWBOX.height) * 100,
});

/** Marker hotspot positions (as % of the map area) for each garden zone */
export const GARDEN_MARKER_POSITIONS_SVG = Object.fromEntries(
  Object.entries(GARDEN_SCENE.zones).map(([id, zone]) => [id, svgPointToPercent(zone.marker)])
) as Record<string, GardenMarkerPosition>;
