// Matchup advantage matrix between hero IDs
// Positive value = heroA has advantage against heroB (e.g. +4.5% winrate swing)
// Negative value = heroA is countered by heroB
export interface MatchupEntry {
  heroId: number
  targetHeroId: number
  advantage: number // percentage points advantage (+/-)
  reasonRu: string
}

export const MATCHUP_DATA: MatchupEntry[] = [
  // Anti-Mage (id 1)
  { heroId: 1, targetHeroId: 94, advantage: 6.8, reasonRu: 'Mana Void наносит колоссальный урон по запасу маны Medusa, обнуляя её Mana Shield.' },
  { heroId: 1, targetHeroId: 17, advantage: 5.4, reasonRu: 'Сжигает ману Storm Spirit при первом же прыжке, лишая его мобильности.' },
  { heroId: 1, targetHeroId: 22, advantage: 5.1, reasonRu: 'Высокое сопротивление магии и легкий блинковый захват беззащитного Zeus.' },
  { heroId: 1, targetHeroId: 74, advantage: 3.8, reasonRu: 'Counterspell отражает направленные прокасты Invoker и сжигает ману в драке.' },
  { heroId: 1, targetHeroId: 2, advantage: -4.5, reasonRu: 'Axe легко ловит AM через Berserker Call сквозь Blink и убивает за время действия.' },
  { heroId: 1, targetHeroId: 70, advantage: -5.2, reasonRu: 'Ursa уничтожает AM в ранних и средних драках за счет Fury Swipes.' },
  { heroId: 1, targetHeroId: 104, advantage: -4.8, reasonRu: 'Duel блокирует Blink и вынуждает драться в рукопашную против высокого урона.' },

  // Axe (id 2)
  { heroId: 2, targetHeroId: 61, advantage: 7.5, reasonRu: 'Пассивный Counter Helix мгновенно зачищает пауков Broodmother.' },
  { heroId: 2, targetHeroId: 82, advantage: 6.8, reasonRu: 'Множество клонов Meepo вызывают частые срабатывания Counter Helix.' },
  { heroId: 2, targetHeroId: 50, advantage: 5.2, reasonRu: 'Culling Blade моментально казнит цели под Shallow Grave Dazzle, игнорируя крест.' },
  { heroId: 2, targetHeroId: 44, advantage: 4.5, reasonRu: 'Berserker Call + Blade Mail заставляет Phantom Assassin убивать саму себя своими критами.' },
  { heroId: 2, targetHeroId: 98, advantage: -5.8, reasonRu: 'Timbersaw снижает силу Axe через Whirling Death и выдерживает физ. урон броней.' },
  { heroId: 2, targetHeroId: 95, advantage: -4.2, reasonRu: 'Troll Warlord под Battle Trance легко переживает дуэли и оглушает топорами.' },

  // Ancient Apparition (id 68)
  { heroId: 68, targetHeroId: 73, advantage: 7.9, reasonRu: 'Ice Blast полностью блокирует химическую регенерацию Chemical Rage Alchemist.' },
  { heroId: 68, targetHeroId: 10, advantage: 7.2, reasonRu: 'Ice Blast замораживает перекачку Morphling в силу, оставляя его без HP.' },
  { heroId: 68, targetHeroId: 36, advantage: 6.9, reasonRu: 'Блокирует лечение Death Pulse и пассивку Heartstopper Necrophos.' },
  { heroId: 68, targetHeroId: 99, advantage: 5.5, reasonRu: 'Блокирует регенерацию Bristleback от Bloodstone и вампиризма.' },
  { heroId: 68, targetHeroId: 1, advantage: -5.0, reasonRu: 'Anti-Mage мгновенно блинкуется на тонкого AA и убивает до ультимейта.' },

  // Disruptor (id 87)
  { heroId: 87, targetHeroId: 17, advantage: 5.8, reasonRu: 'Static Storm + Glimpse не дают Storm Spirit двигаться и нажимать Ball Lightning.' },
  { heroId: 87, targetHeroId: 93, advantage: 4.8, reasonRu: 'Kinetic Field и Glimpse возвращают Slark после прыжка Pounce и ультимейта Shadow Dance.' },
  { heroId: 87, targetHeroId: 63, advantage: 5.1, reasonRu: 'Glimpse возвращает Weaver после Time Lapse на исходную позицию.' },
  { heroId: 87, targetHeroId: 13, advantage: 4.2, reasonRu: 'Glimpse и безмолвие ломают позиционирование Puck при выходе из фазы.' },

  // Silencer (id 75)
  { heroId: 75, targetHeroId: 33, advantage: 6.2, reasonRu: 'Global Silence прерывает Black Hole Enigma из любой точки карты сквозь BKB.' },
  { heroId: 75, targetHeroId: 29, advantage: 4.6, reasonRu: 'Global Silence срывает инициацию Tidehunter и Ravage в решающий момент.' },
  { heroId: 75, targetHeroId: 97, advantage: 4.8, reasonRu: 'Глобальное безмолвие не дает Magnus дать Reverse Polarity после блинка.' },

  // Nyx Assassin (id 88)
  { heroId: 88, targetHeroId: 34, advantage: 6.5, reasonRu: 'Spiked Carapace оглушает Tinker от ракет, а Mind Flare наносит гигантский урон.' },
  { heroId: 88, targetHeroId: 74, advantage: 5.8, reasonRu: 'Mana Burn / Mind Flare ваншотает Invoker с высоким интеллектом.' },
  { heroId: 88, targetHeroId: 76, advantage: 5.2, reasonRu: 'Контрит высокий интеллект Outworld Destroyer и ловит из невидимости.' },

  // Timbersaw (id 98)
  { heroId: 98, targetHeroId: 12, advantage: 6.1, reasonRu: 'Чистый AoE урон мгновенно выкашивает иллюзии Phantom Lancer.' },
  { heroId: 98, targetHeroId: 89, advantage: 5.2, reasonRu: 'Whirling Death срезает деревья Monkey King и лишает его прыжков.' },
  { heroId: 98, targetHeroId: 2, advantage: 5.5, reasonRu: 'Reactive Armor и снижение силы делают Axe бесполезным на линии.' },
  { heroId: 98, targetHeroId: 47, advantage: -5.4, reasonRu: 'Viper накладывает истощение Nethertoxin, отключая пассивную броню Timbersaw.' },

  // Bloodseeker (id 4)
  { heroId: 4, targetHeroId: 93, advantage: 6.2, reasonRu: 'Thirst видит Slark при падении здоровья ниже порога, лишая его пассивного регена.' },
  { heroId: 4, targetHeroId: 63, advantage: 5.8, reasonRu: 'Rupture не позволяет Weaver прожимать Shukuchi без смертельного урона.' },
  { heroId: 4, targetHeroId: 120, advantage: 5.1, reasonRu: 'Rupture наказывает Pangolier за использование Rolling Thunder и Swashbuckle.' },

  // Faceless Void (id 41)
  { heroId: 41, targetHeroId: 63, advantage: 5.5, reasonRu: 'Chronosphere блокирует побег Weaver и убивает без возможности прожать Time Lapse.' },
  { heroId: 41, targetHeroId: 93, advantage: 4.8, reasonRu: 'Slark не может уйти в Shadow Dance внутри Chronosphere.' },
  { heroId: 41, targetHeroId: 1, advantage: 4.2, reasonRu: 'Anti-Mage не может блинкануться и выжить под фокусом в куполе.' },

  // Viper (id 47)
  { heroId: 47, targetHeroId: 99, advantage: 6.5, reasonRu: 'Nethertoxin отключает урон и защиту со спины Bristleback.' },
  { heroId: 47, targetHeroId: 67, advantage: 5.9, reasonRu: 'Истощение отключает Dispersion и Desolate Spectre.' },
  { heroId: 47, targetHeroId: 44, advantage: 5.4, reasonRu: 'Break отключает уклонение Blur и шанс крита Coup de Grace Phantom Assassin.' },
]

// Team synergy pairings
export interface SynergyEntry {
  heroId1: number
  heroId2: number
  synergyScore: number // 1 to 10
  comboName: string
  reasonRu: string
}

export const SYNERGY_DATA: SynergyEntry[] = [
  { heroId1: 41, heroId2: 74, synergyScore: 9.8, comboName: 'Chrono + Cataclysm', reasonRu: 'Chronosphere гарантирует 100% попадание лучей Cataclysm от Invoker.' },
  { heroId1: 41, heroId2: 128, synergyScore: 9.2, comboName: 'Chrono + Mortimer Kisses', reasonRu: 'Snapfire беспрепятственно засыпает врагов в куполе залпом Mortimer Kisses.' },
  { heroId1: 41, heroId2: 30, synergyScore: 9.0, comboName: 'Chrono + Death Ward', reasonRu: 'Death Ward Witch Doctor наносит максимальный урон внутри Chronosphere.' },
  { heroId1: 41, heroId2: 64, synergyScore: 8.8, comboName: 'Chrono + Macropyre', reasonRu: 'Jakiro поджигает обездвиженных врагов огненной дорожкой Macropyre.' },
  { heroId1: 121, heroId2: 69, synergyScore: 9.5, comboName: 'Soulbind + Double Doom', reasonRu: 'Grimstroke связывает двух врагов, и Doom накладывает ультимейт сразу на обоих!' },
  { heroId1: 121, heroId2: 26, synergyScore: 9.2, comboName: 'Soulbind + Finger of Death', reasonRu: 'Lion взрывает сразу две ключевые цели двойным Finger of Death.' },
  { heroId1: 121, heroId2: 36, synergyScore: 9.0, comboName: 'Soulbind + Reaper\'s Scythe', reasonRu: 'Necrophos отправляет в таверну сразу двух вражеских героев.' },
  { heroId1: 71, heroId2: 2, synergyScore: 8.9, comboName: 'Charge + Berserker Call', reasonRu: 'Spirit Breaker влетает с обзором и дает Axe идеальный прыжок с блинка.' },
  { heroId1: 102, heroId2: 99, synergyScore: 9.1, comboName: 'Ion Shell + Bristleback', reasonRu: 'Dark Seer ускоряет Bristleback с помощью Surge и вешает щит Ion Shell.' },
  { heroId1: 91, heroId2: 95, synergyScore: 8.9, comboName: 'Tether + Troll Warlord', reasonRu: 'Io разгоняет безумную скорость атаки и лечит под Overcharge.' },
  { heroId1: 91, heroId2: 10, synergyScore: 9.0, comboName: 'Tether + Morphling', reasonRu: 'Бессмертный дуэт с гигантским сустейном и мобильностью.' },
  { heroId1: 6, heroId2: 35, synergyScore: 8.7, comboName: 'Drow Aura + Sniper', reasonRu: 'Precision Aura усиливает огромную дальность атаки Sniper и скорость пуша.' },
  { heroId1: 7, heroId2: 71, synergyScore: 8.5, comboName: 'Fissure + Global Gank', reasonRu: 'Earthshaker перекрывает отход и выстраивает цепь оглушений.' },
  { heroId1: 86, heroId2: 27, synergyScore: 8.6, comboName: 'Rubick + Shaman Control', reasonRu: 'Нескончаемая цепочка контроля Telekinesis, Hex и Shackles.' },
]

export function getMatchupAdvantage(heroId: number, enemyHeroId: number): { advantage: number; reason?: string } {
  const direct = MATCHUP_DATA.find((m) => m.heroId === heroId && m.targetHeroId === enemyHeroId)
  if (direct) {
    return { advantage: direct.advantage, reason: direct.reasonRu }
  }
  const reverse = MATCHUP_DATA.find((m) => m.heroId === enemyHeroId && m.targetHeroId === heroId)
  if (reverse) {
    return { advantage: -reverse.advantage, reason: `Контрится героем: ${reverse.reasonRu}` }
  }
  return { advantage: 0 }
}

export function getSynergyScore(heroId1: number, heroId2: number): { score: number; comboName?: string; reason?: string } {
  const match = SYNERGY_DATA.find(
    (s) => (s.heroId1 === heroId1 && s.heroId2 === heroId2) || (s.heroId1 === heroId2 && s.heroId2 === heroId1)
  )
  if (match) {
    return { score: match.synergyScore, comboName: match.comboName, reason: match.reasonRu }
  }
  return { score: 5.0 } // baseline neutral synergy
}
