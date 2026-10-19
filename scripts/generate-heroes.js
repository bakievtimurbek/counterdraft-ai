const fs = require('fs');
const path = require('path');

const heroStats = JSON.parse(fs.readFileSync('./src/data/cache/heroStats.json', 'utf8'));

// Specific hand-tuned position profiles for key flex heroes & core archetypes
const specificPositions = {
  // Hard Carries
  "npc_dota_hero_antimage": { 1: 0.98, 2: 0.1, 3: 0.05, 4: 0.02, 5: 0.01 },
  "npc_dota_hero_phantom_assassin": { 1: 0.98, 2: 0.3, 3: 0.05, 4: 0.02, 5: 0.01 },
  "npc_dota_hero_spectre": { 1: 0.98, 2: 0.15, 3: 0.1, 4: 0.02, 5: 0.01 },
  "npc_dota_hero_faceless_void": { 1: 0.98, 2: 0.2, 3: 0.2, 4: 0.05, 5: 0.02 },
  "npc_dota_hero_terrorblade": { 1: 0.98, 2: 0.2, 3: 0.1, 4: 0.3, 5: 0.2 },
  "npc_dota_hero_medusa": { 1: 0.95, 2: 0.6, 3: 0.15, 4: 0.05, 5: 0.01 },
  "npc_dota_hero_slark": { 1: 0.95, 2: 0.3, 3: 0.15, 4: 0.05, 5: 0.01 },
  "npc_dota_hero_ursa": { 1: 0.92, 2: 0.3, 3: 0.35, 4: 0.05, 5: 0.01 },
  "npc_dota_hero_troll_warlord": { 1: 0.95, 2: 0.4, 3: 0.15, 4: 0.02, 5: 0.01 },
  "npc_dota_hero_morphling": { 1: 0.96, 2: 0.75, 3: 0.1, 4: 0.05, 5: 0.02 },
  "npc_dota_hero_drow_ranger": { 1: 0.95, 2: 0.5, 3: 0.1, 4: 0.02, 5: 0.01 },
  "npc_dota_hero_luna": { 1: 0.96, 2: 0.3, 3: 0.1, 4: 0.1, 5: 0.05 },
  "npc_dota_hero_bloodseeker": { 1: 0.85, 2: 0.6, 3: 0.65, 4: 0.2, 5: 0.1 },
  "npc_dota_hero_chaos_knight": { 1: 0.9, 2: 0.2, 3: 0.75, 4: 0.2, 5: 0.1 },
  "npc_dota_hero_juggernaut": { 1: 0.98, 2: 0.2, 3: 0.1, 4: 0.05, 5: 0.02 },
  "npc_dota_hero_sniper": { 1: 0.6, 2: 0.9, 3: 0.2, 4: 0.5, 5: 0.2 },
  
  // Iconic Flex Heroes
  "npc_dota_hero_mirana": { 1: 0.5, 2: 0.65, 3: 0.45, 4: 0.92, 5: 0.65 },
  "npc_dota_hero_tiny": { 1: 0.82, 2: 0.88, 3: 0.45, 4: 0.85, 5: 0.35 },
  "npc_dota_hero_windrunner": { 1: 0.6, 2: 0.82, 3: 0.75, 4: 0.78, 5: 0.45 },
  "npc_dota_hero_pudge": { 1: 0.55, 2: 0.45, 3: 0.85, 4: 0.82, 5: 0.65 },
  "npc_dota_hero_doom_bringer": { 1: 0.65, 2: 0.35, 3: 0.95, 4: 0.45, 5: 0.2 },
  "npc_dota_hero_furion": { 1: 0.65, 2: 0.65, 3: 0.75, 4: 0.88, 5: 0.82 },
  "npc_dota_hero_snapfire": { 1: 0.2, 2: 0.8, 3: 0.5, 4: 0.9, 5: 0.85 },
  "npc_dota_hero_invoker": { 1: 0.1, 2: 0.98, 3: 0.2, 4: 0.65, 5: 0.2 },
  "npc_dota_hero_hoodwink": { 1: 0.1, 2: 0.55, 3: 0.3, 4: 0.92, 5: 0.75 },
  "npc_dota_hero_viper": { 1: 0.4, 2: 0.88, 3: 0.85, 4: 0.3, 5: 0.2 },
  "npc_dota_hero_razor": { 1: 0.75, 2: 0.85, 3: 0.88, 4: 0.2, 5: 0.1 },
  "npc_dota_hero_leshrac": { 1: 0.75, 2: 0.95, 3: 0.65, 4: 0.4, 5: 0.2 },
  "npc_dota_hero_lina": { 1: 0.85, 2: 0.9, 3: 0.3, 4: 0.6, 5: 0.3 },
  "npc_dota_hero_dragon_knight": { 1: 0.7, 2: 0.9, 3: 0.92, 4: 0.3, 5: 0.1 },
  "npc_dota_hero_earthshaker": { 1: 0.1, 2: 0.65, 3: 0.75, 4: 0.95, 5: 0.55 },
  "npc_dota_hero_marci": { 1: 0.75, 2: 0.4, 3: 0.7, 4: 0.88, 5: 0.6 },
  "npc_dota_hero_dawnbreaker": { 1: 0.72, 2: 0.4, 3: 0.9, 4: 0.75, 5: 0.5 },
  "npc_dota_hero_kunkka": { 1: 0.4, 2: 0.88, 3: 0.9, 4: 0.55, 5: 0.2 },
  "npc_dota_hero_necrolyte": { 1: 0.6, 2: 0.85, 3: 0.9, 4: 0.3, 5: 0.2 },
  "npc_dota_hero_pugna": { 1: 0.1, 2: 0.65, 3: 0.35, 4: 0.9, 5: 0.85 },
  "npc_dota_hero_muerta": { 1: 0.92, 2: 0.65, 3: 0.3, 4: 0.65, 5: 0.35 },
  "npc_dota_hero_sven": { 1: 0.88, 2: 0.2, 3: 0.45, 4: 0.65, 5: 0.7 },
  "npc_dota_hero_weaver": { 1: 0.85, 2: 0.5, 3: 0.4, 4: 0.82, 5: 0.5 },
  "npc_dota_hero_gyrocopter": { 1: 0.9, 2: 0.5, 3: 0.25, 4: 0.78, 5: 0.65 },
  "npc_dota_hero_alchemist": { 1: 0.9, 2: 0.82, 3: 0.6, 4: 0.3, 5: 0.2 },
  "npc_dota_hero_bounty_hunter": { 1: 0.2, 2: 0.4, 3: 0.75, 4: 0.9, 5: 0.6 },
  "npc_dota_hero_enigma": { 1: 0.05, 2: 0.3, 3: 0.9, 4: 0.8, 5: 0.6 },
  "npc_dota_hero_batrider": { 1: 0.1, 2: 0.82, 3: 0.88, 4: 0.78, 5: 0.4 },
  "npc_dota_hero_monkey_king": { 1: 0.88, 2: 0.85, 3: 0.4, 4: 0.75, 5: 0.3 },
  "npc_dota_hero_pangolier": { 1: 0.3, 2: 0.9, 3: 0.9, 4: 0.5, 5: 0.1 },
  "npc_dota_hero_primal_beast": { 1: 0.2, 2: 0.85, 3: 0.95, 4: 0.65, 5: 0.2 },
  "npc_dota_hero_kez": { 1: 0.88, 2: 0.82, 3: 0.6, 4: 0.3, 5: 0.1 },
  "npc_dota_hero_ringmaster": { 1: 0.05, 2: 0.45, 3: 0.2, 4: 0.95, 5: 0.9 },

  // Midlaners
  "npc_dota_hero_storm_spirit": { 1: 0.1, 2: 0.98, 3: 0.05, 4: 0.05, 5: 0.01 },
  "npc_dota_hero_puck": { 1: 0.05, 2: 0.98, 3: 0.3, 4: 0.3, 5: 0.05 },
  "npc_dota_hero_queenofpain": { 1: 0.2, 2: 0.98, 3: 0.25, 4: 0.2, 5: 0.05 },
  "npc_dota_hero_nevermore": { 1: 0.6, 2: 0.98, 3: 0.1, 4: 0.05, 5: 0.01 },
  "npc_dota_hero_tinker": { 1: 0.05, 2: 0.8, 3: 0.2, 4: 0.75, 5: 0.55 },
  "npc_dota_hero_void_spirit": { 1: 0.2, 2: 0.98, 3: 0.4, 4: 0.35, 5: 0.05 },
  "npc_dota_hero_ember_spirit": { 1: 0.6, 2: 0.98, 3: 0.3, 4: 0.15, 5: 0.05 },
  "npc_dota_hero_earth_spirit": { 1: 0.05, 2: 0.8, 3: 0.5, 4: 0.95, 5: 0.6 },
  "npc_dota_hero_templar_assassin": { 1: 0.85, 2: 0.95, 3: 0.1, 4: 0.05, 5: 0.01 },
  "npc_dota_hero_shadow_demon": { 1: 0.02, 2: 0.15, 3: 0.1, 4: 0.85, 5: 0.95 },
  "npc_dota_hero_rubick": { 1: 0.02, 2: 0.45, 3: 0.1, 4: 0.98, 5: 0.8 },

  // Offlaners
  "npc_dota_hero_centaur": { 1: 0.1, 2: 0.15, 3: 0.98, 4: 0.4, 5: 0.2 },
  "npc_dota_hero_tidehunter": { 1: 0.1, 2: 0.1, 3: 0.98, 4: 0.3, 5: 0.3 },
  "npc_dota_hero_axe": { 1: 0.2, 2: 0.15, 3: 0.98, 4: 0.15, 5: 0.05 },
  "npc_dota_hero_mars": { 1: 0.1, 2: 0.3, 3: 0.98, 4: 0.3, 5: 0.1 },
  "npc_dota_hero_slardar": { 1: 0.45, 2: 0.2, 3: 0.98, 4: 0.4, 5: 0.15 },
  "npc_dota_hero_underlord": { 1: 0.1, 2: 0.1, 3: 0.98, 4: 0.3, 5: 0.2 },
  "npc_dota_hero_beastmaster": { 1: 0.2, 2: 0.4, 3: 0.98, 4: 0.35, 5: 0.1 },
  "npc_dota_hero_timbersaw": { 1: 0.2, 2: 0.85, 3: 0.95, 4: 0.1, 5: 0.05 },
  "npc_dota_hero_dark_seer": { 1: 0.05, 2: 0.15, 3: 0.98, 4: 0.4, 5: 0.2 },
  "npc_dota_hero_night_stalker": { 1: 0.2, 2: 0.4, 3: 0.98, 4: 0.4, 5: 0.1 },
  "npc_dota_hero_bristleback": { 1: 0.8, 2: 0.3, 3: 0.95, 4: 0.15, 5: 0.05 },
  "npc_dota_hero_magnataur": { 1: 0.2, 2: 0.6, 3: 0.95, 4: 0.7, 5: 0.3 },

  // Hard Supports
  "npc_dota_hero_crystal_maiden": { 1: 0.01, 2: 0.05, 3: 0.05, 4: 0.8, 5: 0.98 },
  "npc_dota_hero_disruptor": { 1: 0.01, 2: 0.05, 3: 0.05, 4: 0.75, 5: 0.98 },
  "npc_dota_hero_dazzle": { 1: 0.1, 2: 0.6, 3: 0.3, 4: 0.8, 5: 0.95 },
  "npc_dota_hero_oracle": { 1: 0.01, 2: 0.2, 3: 0.05, 4: 0.75, 5: 0.98 },
  "npc_dota_hero_treant": { 1: 0.05, 2: 0.05, 3: 0.4, 4: 0.75, 5: 0.98 },
  "npc_dota_hero_lich": { 1: 0.01, 2: 0.05, 3: 0.05, 4: 0.8, 5: 0.98 },
  "npc_dota_hero_jakiro": { 1: 0.02, 2: 0.3, 3: 0.35, 4: 0.85, 5: 0.95 },
  "npc_dota_hero_lion": { 1: 0.01, 2: 0.2, 3: 0.05, 4: 0.95, 5: 0.9 },
  "npc_dota_hero_shadow_shaman": { 1: 0.02, 2: 0.25, 3: 0.2, 4: 0.88, 5: 0.95 },
  "npc_dota_hero_witch_doctor": { 1: 0.01, 2: 0.15, 3: 0.1, 4: 0.85, 5: 0.98 },
  "npc_dota_hero_warlock": { 1: 0.01, 2: 0.1, 3: 0.1, 4: 0.6, 5: 0.98 },
  "npc_dota_hero_bane": { 1: 0.01, 2: 0.2, 3: 0.15, 4: 0.7, 5: 0.98 },
  "npc_dota_hero_silencer": { 1: 0.3, 2: 0.6, 3: 0.2, 4: 0.8, 5: 0.9 },
  "npc_dota_hero_grimstroke": { 1: 0.01, 2: 0.2, 3: 0.1, 4: 0.9, 5: 0.9 },
  "npc_dota_hero_omniknight": { 1: 0.4, 2: 0.2, 3: 0.75, 4: 0.7, 5: 0.85 },
  "npc_dota_hero_abaddon": { 1: 0.7, 2: 0.2, 3: 0.8, 4: 0.6, 5: 0.9 },
  "npc_dota_hero_keeper_of_the_light": { 1: 0.02, 2: 0.7, 3: 0.15, 4: 0.9, 5: 0.85 },
  "npc_dota_hero_undying": { 1: 0.1, 2: 0.1, 3: 0.65, 4: 0.65, 5: 0.95 },
  "npc_dota_hero_io": { 1: 0.3, 2: 0.3, 3: 0.2, 4: 0.85, 5: 0.95 },
  "npc_dota_hero_chen": { 1: 0.01, 2: 0.05, 3: 0.1, 4: 0.7, 5: 0.98 },
  "npc_dota_hero_enchantress": { 1: 0.2, 2: 0.3, 3: 0.5, 4: 0.88, 5: 0.9 },
  "npc_dota_hero_ancient_apparition": { 1: 0.01, 2: 0.2, 3: 0.05, 4: 0.8, 5: 0.95 },
  "npc_dota_hero_tusk": { 1: 0.2, 2: 0.6, 3: 0.6, 4: 0.95, 5: 0.65 },
  "npc_dota_hero_clockwerk": { 1: 0.05, 2: 0.2, 3: 0.8, 4: 0.92, 5: 0.8 }
};

function inferPositions(hero) {
  if (specificPositions[hero.name]) {
    return specificPositions[hero.name];
  }
  const roles = hero.roles || [];
  const isCarry = roles.includes('Carry');
  const isSupport = roles.includes('Support');
  const isInitiator = roles.includes('Initiator');
  const isDurable = roles.includes('Durable');
  const isNuker = roles.includes('Nuker');
  const isEscape = roles.includes('Escape');

  let pos = { 1: 0.1, 2: 0.2, 3: 0.2, 4: 0.2, 5: 0.1 };

  if (isCarry && !isSupport) {
    pos[1] = 0.9;
    pos[2] = isNuker || isEscape ? 0.7 : 0.2;
    pos[3] = isDurable ? 0.6 : 0.1;
    pos[4] = 0.1;
    pos[5] = 0.05;
  } else if (isSupport && !isCarry) {
    pos[1] = 0.05;
    pos[2] = isNuker ? 0.4 : 0.1;
    pos[3] = isInitiator || isDurable ? 0.5 : 0.1;
    pos[4] = 0.9;
    pos[5] = 0.9;
  } else if (isInitiator || isDurable) {
    pos[1] = 0.3;
    pos[2] = 0.5;
    pos[3] = 0.95;
    pos[4] = 0.6;
    pos[5] = 0.2;
  } else {
    pos[1] = 0.3;
    pos[2] = 0.8;
    pos[3] = 0.5;
    pos[4] = 0.5;
    pos[5] = 0.3;
  }
  return pos;
}

function inferComplexity(hero) {
  const high = ['Invoker', 'Meepo', 'Chen', 'Earth Spirit', 'Morphling', 'Io', 'Arc Warden', 'Visage', 'Tinker', 'Lone Druid', 'Brewmaster', 'Kez'];
  const low = ['Wraith King', 'Viper', 'Dragon Knight', 'Ogre Magi', 'Sniper', 'Tidehunter', 'Crystal Maiden', 'Lich', 'Bristleback', 'Ursa', 'Juggernaut', 'Drow Ranger', 'Centaur Warrunner', 'Lion', 'Axe'];
  if (high.includes(hero.localized_name)) return 3;
  if (low.includes(hero.localized_name)) return 1;
  return 2;
}

const heroes = heroStats.map(h => {
  // calculate pub winrate
  let totalPicks = 0;
  let totalWins = 0;
  for (let i = 1; i <= 8; i++) {
    totalPicks += h[`${i}_pick`] || 0;
    totalWins += h[`${i}_win`] || 0;
  }
  const pubWinrate = totalPicks > 0 ? Number(((totalWins / totalPicks) * 100).toFixed(2)) : 50.0;
  const proWinrate = (h.pro_pick && h.pro_pick > 0) ? Number(((h.pro_win / h.pro_pick) * 100).toFixed(2)) : undefined;

  const shortName = h.name.replace('npc_dota_hero_', '');
  const portraitUrl = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${shortName}.png`;
  const iconUrl = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/icons/${shortName}.png`;

  return {
    id: h.id,
    name: h.name,
    localized_name: h.localized_name,
    primary_attr: h.primary_attr,
    attack_type: h.attack_type,
    roles: h.roles || [],
    img: portraitUrl,
    icon: iconUrl,
    base_health: h.base_health || 200,
    base_mana: h.base_mana || 75,
    base_armor: h.base_armor || 0,
    base_attack_min: h.base_attack_min || 20,
    base_attack_max: h.base_attack_max || 30,
    base_str: h.base_str || 20,
    base_agi: h.base_agi || 20,
    base_int: h.base_int || 20,
    str_gain: h.str_gain || 2.0,
    agi_gain: h.agi_gain || 2.0,
    int_gain: h.int_gain || 2.0,
    attack_range: h.attack_range || 150,
    move_speed: h.move_speed || 300,
    pro_pick_rate: h.pro_pick || 0,
    pro_win_rate: proWinrate,
    pub_win_rate: pubWinrate,
    complexity: inferComplexity(h),
    positions: inferPositions(h),
    description: `${h.localized_name} — ${h.attack_type === 'Melee' ? 'ближний' : 'дальний'} бой, основной атрибут: ${h.primary_attr.toUpperCase()}. Роли: ${(h.roles || []).join(', ')}.`,
  };
});

// Sort heroes alphabetically by localized_name
heroes.sort((a, b) => a.localized_name.localeCompare(b.localized_name));

const fileContent = `import { Hero } from '@/types/dota'

export const HEROES: Hero[] = ${JSON.stringify(heroes, null, 2)}

export const HERO_MAP = new Map<number, Hero>(HEROES.map((h) => [h.id, h]))
export const HERO_NAME_MAP = new Map<string, Hero>(HEROES.map((h) => [h.localized_name.toLowerCase(), h]))

export function getHeroById(id: number): Hero | undefined {
  return HERO_MAP.get(id)
}

export function getHeroByName(name: string): Hero | undefined {
  return HERO_NAME_MAP.get(name.toLowerCase())
}
`;

fs.writeFileSync('./src/data/heroes.ts', fileContent, 'utf8');
console.log(`Generated src/data/heroes.ts with ${heroes.length} heroes!`);
