import type { IconType } from 'react-icons';
import {
  LuBookOpen,
  LuHeart,
  LuHouse,
  LuLink,
  LuPalette,
  LuShield,
} from 'react-icons/lu';
import { APP_ROUTES } from './route';

export interface GardenZone {
  id: string;
  labelKey: string;
  descKey: string;
  icon: IconType;
  route: string;
  comingSoon?: boolean;
}

export const GARDEN_ZONES: GardenZone[] = [
  {
    id: 'tam-tri',
    labelKey: 'garden.zones.mind.title',
    descKey: 'garden.zones.mind.description',
    icon: LuHouse,
    route: APP_ROUTES.WELCOME,
  },
  {
    id: 'tu-chiem-nghiem',
    labelKey: 'garden.zones.reflection.title',
    descKey: 'garden.zones.reflection.description',
    icon: LuBookOpen,
    route: APP_ROUTES.REFLECTION_ZONE,
  },
  {
    id: 'sang-tao',
    labelKey: 'garden.zones.creativity.title',
    descKey: 'garden.zones.creativity.description',
    icon: LuPalette,
    route: APP_ROUTES.CREATIVITY_ZONE,
    comingSoon: true,
  },
  {
    id: 'ket-noi',
    labelKey: 'garden.zones.connection.title',
    descKey: 'garden.zones.connection.description',
    icon: LuLink,
    route: APP_ROUTES.CONNECTION_ZONE,
    comingSoon: true,
  },
  {
    id: 'cam-xuc',
    labelKey: 'garden.zones.emotion.title',
    descKey: 'garden.zones.emotion.description',
    icon: LuHeart,
    route: APP_ROUTES.EMOTION_ZONE,
  },
  {
    id: 'bo-loc',
    labelKey: 'garden.zones.filter.title',
    descKey: 'garden.zones.filter.description',
    icon: LuShield,
    route: APP_ROUTES.PHUONG_PHAP,
  },
];

export const getGardenZoneById = (id: string): GardenZone | undefined =>
  GARDEN_ZONES.find((zone) => zone.id === id);
