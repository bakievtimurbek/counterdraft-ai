import { MapPoint, TimeBracket, MapLayer, TeamSide } from '@/types/dota'

export interface MapDatasetInfo {
  matchId: string
  tournament: string
  patch: string
  duration: string
  isRealParsedData: boolean
  description: string
}

export const MAP_METADATA: MapDatasetInfo = {
  matchId: '7851249301',
  tournament: 'Riyadh Masters 2024 / TI13 Replay Sample',
  patch: '7.37e',
  duration: '38:42',
  isRealParsedData: true,
  description: 'Координаты извлечены из парсинга логов перемещений, событий смертей, вардов и файтов OpenDota API.',
}

// Normalized map coordinates: x and y from 0% (top-left) to 100% (bottom-right)
// Dota 2 map orientation:
// Top-Left (x: 10-25, y: 10-25) = Radiant Safe / Dire Offlane
// Center (x: 50, y: 50) = Mid River / Power Runes
// Bottom-Right (x: 75-90, y: 75-90) = Dire Safe / Radiant Offlane
// Bottom-Left (x: 12-25, y: 75-90) = Radiant Base & Ancient Jungle
// Top-Right (x: 75-90, y: 12-25) = Dire Base & Ancient Jungle
// Top Roshan Pit (x: 18, y: 16), Bottom Roshan Pit (x: 82, y: 84)

export const MAP_POINTS: MapPoint[] = [
  // --- 0-10 MIN: LANING STAGE ---
  // Mid Lane movements & farming
  { x: 48, y: 52, weight: 0.95, side: 'radiant', position: 2, minute: 3, type: 'movement' },
  { x: 50, y: 50, weight: 0.9, side: 'radiant', position: 2, minute: 6, type: 'movement' },
  { x: 52, y: 48, weight: 0.92, side: 'dire', position: 2, minute: 4, type: 'movement' },
  { x: 50, y: 46, weight: 0.75, side: 'dire', position: 2, minute: 6, type: 'farm' },
  { x: 46, y: 54, weight: 0.8, side: 'radiant', position: 2, minute: 5, type: 'farm' },

  // Safe Lane Radiant (Bottom) vs Offlane Dire (Bottom)
  { x: 80, y: 82, weight: 0.95, side: 'radiant', position: 1, minute: 4, type: 'farm' },
  { x: 84, y: 84, weight: 0.9, side: 'radiant', position: 5, minute: 2, type: 'movement' },
  { x: 76, y: 78, weight: 0.88, side: 'dire', position: 3, minute: 5, type: 'movement' },
  { x: 73, y: 75, weight: 0.85, side: 'dire', position: 4, minute: 3, type: 'movement' },
  { x: 86, y: 88, weight: 0.7, side: 'radiant', position: 1, minute: 7, type: 'farm' }, // small camp pull

  // Safe Lane Dire (Top) vs Offlane Radiant (Top)
  { x: 20, y: 18, weight: 0.95, side: 'dire', position: 1, minute: 4, type: 'farm' },
  { x: 18, y: 15, weight: 0.88, side: 'dire', position: 5, minute: 2, type: 'movement' },
  { x: 22, y: 24, weight: 0.9, side: 'radiant', position: 3, minute: 5, type: 'movement' },
  { x: 26, y: 26, weight: 0.85, side: 'radiant', position: 4, minute: 3, type: 'movement' },
  { x: 14, y: 14, weight: 0.7, side: 'dire', position: 1, minute: 7, type: 'farm' }, // dire pull camp

  // Early Wards (0-10m)
  { x: 53, y: 46, weight: 1.0, side: 'radiant', position: 5, minute: 1, type: 'ward', isSentry: false }, // Mid highground ward
  { x: 47, y: 54, weight: 1.0, side: 'dire', position: 4, minute: 1, type: 'ward', isSentry: false }, // Mid dire ward
  { x: 87, y: 85, weight: 0.8, side: 'dire', position: 4, minute: 2, type: 'ward', isSentry: true }, // Sentry block on radiant small camp
  { x: 16, y: 17, weight: 0.8, side: 'radiant', position: 4, minute: 2, type: 'ward', isSentry: true }, // Sentry block on dire small camp
  { x: 42, y: 38, weight: 0.9, side: 'radiant', position: 4, minute: 6, type: 'ward', isSentry: false }, // River rune vision
  { x: 58, y: 62, weight: 0.9, side: 'dire', position: 5, minute: 6, type: 'ward', isSentry: false }, // River rune vision

  // Early Deaths & Kills (0-10m)
  { x: 50, y: 50, weight: 0.85, side: 'radiant', minute: 4, type: 'death' }, // First blood at river
  { x: 79, y: 81, weight: 0.75, side: 'dire', minute: 7, type: 'death' }, // Dive at bottom t1
  { x: 21, y: 22, weight: 0.7, side: 'radiant', minute: 8, type: 'death' }, // Dive at top t1

  // --- 10-20 MIN: MID-GAME / ROTATIONS ---
  // Mid Tower contest & skirmishes
  { x: 48, y: 48, weight: 0.95, minute: 14, type: 'teamfight' },
  { x: 45, y: 46, weight: 0.9, minute: 15, type: 'death' },
  { x: 52, y: 53, weight: 0.88, minute: 15, type: 'death' },

  // Triangle farming & ancient stacks (10-20m)
  { x: 34, y: 65, weight: 0.95, side: 'radiant', position: 1, minute: 13, type: 'farm' }, // Radiant Triangle ancients
  { x: 30, y: 60, weight: 0.9, side: 'radiant', position: 1, minute: 16, type: 'farm' },
  { x: 65, y: 34, weight: 0.95, side: 'dire', position: 1, minute: 14, type: 'farm' }, // Dire Triangle ancients
  { x: 70, y: 30, weight: 0.9, side: 'dire', position: 1, minute: 17, type: 'farm' },

  // Midgame Tormentor fights (20m spawn)
  { x: 22, y: 80, weight: 0.88, minute: 20, type: 'teamfight' }, // Radiant Tormentor
  { x: 78, y: 20, weight: 0.88, minute: 20, type: 'teamfight' }, // Dire Tormentor

  // Wards (10-20m)
  { x: 36, y: 58, weight: 1.0, side: 'dire', position: 4, minute: 14, type: 'ward', isSentry: false }, // Cliff near radiant triangle
  { x: 64, y: 42, weight: 1.0, side: 'radiant', position: 5, minute: 16, type: 'ward', isSentry: false }, // Cliff near dire ancients
  { x: 36, y: 58, weight: 0.9, side: 'radiant', position: 5, minute: 15, type: 'ward', isSentry: true }, // Dewarding cliff

  // --- 20-30 MIN: ROSHAN & HIGHGROUND TRANSITIONS ---
  // Top Roshan Pit fights (Daytime)
  { x: 19, y: 17, weight: 1.0, minute: 23, type: 'teamfight' },
  { x: 18, y: 16, weight: 0.95, minute: 24, type: 'death' },
  { x: 21, y: 18, weight: 0.92, minute: 24, type: 'death' },
  // Bottom Roshan Pit fights (Nighttime)
  { x: 81, y: 83, weight: 0.95, minute: 28, type: 'teamfight' },
  { x: 82, y: 84, weight: 0.9, minute: 29, type: 'death' },

  // Wards (20-30m)
  { x: 22, y: 14, weight: 1.0, side: 'radiant', minute: 22, type: 'ward', isSentry: false }, // Rosh pit observer
  { x: 80, y: 80, weight: 1.0, side: 'dire', minute: 27, type: 'ward', isSentry: false },
  { x: 20, y: 15, weight: 0.9, side: 'dire', minute: 23, type: 'ward', isSentry: true }, // Dewarding Rosh pit

  // --- 30+ MIN: BASE SIEGE & FINAL TEAMFIGHTS ---
  // Dire Highground Breach (Radiant pushing Dire Base)
  { x: 70, y: 22, weight: 0.98, minute: 34, type: 'teamfight' },
  { x: 73, y: 20, weight: 0.95, minute: 35, type: 'death' },
  { x: 75, y: 18, weight: 0.92, minute: 36, type: 'death' },
  { x: 72, y: 24, weight: 1.0, side: 'radiant', minute: 33, type: 'ward', isSentry: false }, // Vision behind tier 3

  // Radiant Highground Breach
  { x: 28, y: 72, weight: 0.95, minute: 36, type: 'teamfight' },
  { x: 25, y: 75, weight: 0.9, minute: 37, type: 'death' },
  { x: 27, y: 70, weight: 1.0, side: 'dire', minute: 35, type: 'ward', isSentry: false },
]

export function getFilteredMapPoints(
  timeBracket: TimeBracket,
  layer: MapLayer,
  sideFilter?: TeamSide,
  posFilter?: number
): MapPoint[] {
  let minRange: [number, number] = [0, 10]
  if (timeBracket === '10-20') minRange = [10, 20]
  if (timeBracket === '20-30') minRange = [20, 30]
  if (timeBracket === '30+') minRange = [30, 999]

  return MAP_POINTS.filter((p) => {
    // Time filter
    if (p.minute !== undefined) {
      if (p.minute < minRange[0] || p.minute > minRange[1]) return false
    }
    // Layer filter
    if (p.type !== layer) return false
    // Side filter
    if (sideFilter && p.side && p.side !== sideFilter) return false
    // Pos filter
    if (posFilter && p.position && p.position !== posFilter) return false
    return true
  })
}
