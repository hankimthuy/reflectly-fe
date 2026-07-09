import { GARDEN_MAP_VIEWBOX } from '../../constants/gardenMapScene';
import './GardenMapIllustration.scss';

const { width, height } = GARDEN_MAP_VIEWBOX;

/** Coded SVG garden map — no bottom text panels */
const GardenMapIllustration = () => (
  <svg
    className="garden-map-illustration"
    viewBox={`0 0 ${width} ${height}`}
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="garden-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E8F4E1" />
        <stop offset="55%" stopColor="#D4E8C8" />
        <stop offset="100%" stopColor="#B8D4A8" />
      </linearGradient>
      <linearGradient id="hedge-fill" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6B9B5E" />
        <stop offset="100%" stopColor="#4A7349" />
      </linearGradient>
      <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#2C3E2D" floodOpacity="0.12" />
      </filter>
    </defs>

    <rect width={width} height={height} fill="url(#garden-sky)" />

    <ellipse cx="130" cy="130" rx="95" ry="70" fill="#C5DEB8" opacity="0.55" />
    <ellipse cx="130" cy="390" rx="95" ry="70" fill="#C5DEB8" opacity="0.55" />
    <ellipse cx="670" cy="130" rx="95" ry="70" fill="#C5DEB8" opacity="0.55" />
    <ellipse cx="670" cy="390" rx="95" ry="70" fill="#C5DEB8" opacity="0.55" />

    <ReflectionVignette />
    <CreativityVignette />
    <ConnectionVignette />
    <EmotionVignette />
    <CentralGarden />
  </svg>
);

const CentralGarden = () => (
  <g className="garden-map-illustration__center" filter="url(#soft-shadow)">
    <ellipse cx="400" cy="268" rx="168" ry="118" fill="url(#hedge-fill)" opacity="0.92" />
    <ellipse cx="400" cy="268" rx="148" ry="102" fill="#8FBF8F" opacity="0.35" />
    <ellipse cx="400" cy="272" rx="128" ry="88" fill="#A8CF98" />
    <ellipse cx="330" cy="300" rx="28" ry="16" fill="#7EB8C9" opacity="0.85" />
    <ellipse cx="330" cy="298" rx="20" ry="10" fill="#9AD4E0" opacity="0.5" />

    <g transform="translate(470, 250)">
      <rect x="-4" y="18" width="8" height="22" fill="#8B6F47" rx="2" />
      <circle cx="0" cy="8" r="26" fill="#5B8C5A" />
      <circle cx="-12" cy="14" r="18" fill="#6B9B5E" />
      <circle cx="14" cy="12" r="16" fill="#4A7349" />
    </g>

    <g transform="translate(400, 218)">
      <path d="M -52 42 L 0 68 L 52 42 L 52 8 L 0 -8 L -52 8 Z" fill="#C49A6C" />
      <path d="M -52 8 L 0 24 L 52 8 L 52 42 L 0 68 L -52 42 Z" fill="#A67B5B" />
      <path d="M -58 6 L 0 -28 L 58 6 L 0 20 Z" fill="#8B6F47" />
      <path d="M -10 28 L 10 28 L 10 48 L -10 48 Z" fill="#6B4F35" />
      <rect x="-36" y="18" width="18" height="16" rx="2" fill="#FFE9A8" opacity="0.9" />
      <rect x="18" y="18" width="18" height="16" rx="2" fill="#FFE9A8" opacity="0.9" />
      <rect x="-8" y="2" width="16" height="12" rx="2" fill="#FFE9A8" opacity="0.85" />
    </g>

    <g transform="translate(355, 318)">
      <ellipse cx="0" cy="8" rx="22" ry="8" fill="#2C3E2D" opacity="0.08" />
      <rect x="-16" y="-4" width="32" height="6" fill="#A67B5B" rx="1" />
      <rect x="-2" y="-18" width="4" height="14" fill="#8B6F47" />
      <circle cx="0" cy="-22" r="7" fill="#E8C4A8" />
      <rect x="-8" y="-12" width="10" height="8" fill="#F5EDD6" stroke="#8B6F47" strokeWidth="0.5" />
    </g>

    <g transform="translate(400, 358)">
      <path d="M -24 0 L -24 36 L 24 36 L 24 0" fill="none" stroke="#8B6F47" strokeWidth="4" />
      <path d="M -20 4 L -20 32 M 20 4 L 20 32" stroke="#A67B5B" strokeWidth="2" />
    </g>
  </g>
);

const ReflectionVignette = () => (
  <g transform="translate(108, 148)" opacity="0.9">
    <ellipse cx="0" cy="20" rx="40" ry="24" fill="#B8D4A8" />
    <circle cx="-8" cy="0" r="10" fill="#E8C4A8" />
    <rect x="-18" y="8" width="22" height="16" rx="3" fill="#C49A6C" />
    <rect x="6" y="4" width="14" height="18" rx="1" fill="#8B4545" />
    <rect x="8" y="7" width="10" height="2" fill="#F5EDD6" />
    <rect x="8" y="11" width="10" height="2" fill="#F5EDD6" opacity="0.7" />
  </g>
);

const CreativityVignette = () => (
  <g transform="translate(128, 372)" opacity="0.9">
    <ellipse cx="0" cy="16" rx="44" ry="26" fill="#D4C4A8" />
    <ellipse cx="-18" cy="4" rx="12" ry="16" fill="#B87A50" />
    <ellipse cx="4" cy="0" rx="10" ry="14" fill="#C49A6C" />
    <ellipse cx="22" cy="6" rx="11" ry="15" fill="#A67B5B" />
    <rect x="-6" y="-18" width="12" height="10" rx="2" fill="#8B6F47" />
  </g>
);

const ConnectionVignette = () => (
  <g transform="translate(672, 148)" opacity="0.9">
    <path d="M -30 30 L -30 0 L 30 0 L 30 30" fill="none" stroke="#7A8B72" strokeWidth="3" />
    <path d="M -22 30 L -22 8 L 22 8 L 22 30" fill="none" stroke="#9AA892" strokeWidth="2" />
    <path d="M -8 8 L -8 -12 L 8 -12 L 8 8" fill="#8B9B82" />
    <circle cx="0" cy="-16" r="4" fill="#6B7B62" />
    <ellipse cx="0" cy="38" rx="36" ry="12" fill="#A8CF98" opacity="0.6" />
  </g>
);

const EmotionVignette = () => (
  <g transform="translate(672, 372)" opacity="0.9">
    <ellipse cx="0" cy="12" rx="40" ry="24" fill="#7EB8C9" opacity="0.75" />
    <ellipse cx="-12" cy="14" rx="10" ry="6" fill="#5A9AAA" opacity="0.5" />
    <ellipse cx="14" cy="16" rx="8" ry="5" fill="#5A9AAA" opacity="0.5" />
    <path d="M 0 -4 C -8 -12 -16 -4 -8 4 C 0 12 8 4 0 -4" fill="#E8A0BF" />
    <circle cx="0" cy="2" r="5" fill="#F0B8CC" />
  </g>
);

export default GardenMapIllustration;
