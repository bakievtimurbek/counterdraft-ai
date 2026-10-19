import { ProPlayer } from '@/types/dota'

export const PRO_PLAYERS: ProPlayer[] = [
  // --- POSITION 1: CARRY ---
  {
    id: 'yatoro',
    name: 'Yatoro (Raddan)',
    team: 'Team Spirit',
    position: 1,
    country: 'UA',
    signatureHeroes: [10, 44, 41, 1, 95], // Morphling, PA, Void, AM, Troll
    skillSpecialties: ['farming', 'positioning', 'teamfight_decisions'],
    coachingPhilosophy:
      'Идеальное распределение фарма по карте и терпение в драке. Никогда не вступай первым, пока враг не отдаст ключевые заклинания контроля.',
    notableMatches: [
      {
        matchId: '7398124012',
        heroId: 10,
        heroName: 'Morphling',
        opponent: 'Gaimin Gladiators',
        tournament: 'The International 2023 Grand Final',
        date: '2023-10-29',
        csAt10: 84,
        networthAt20: 14200,
        vodTimestamp: '18:45',
        keyTakeaway: 'Сдвиг в треугольник ровно на 8:00 после падения вышки. Использование Waveform исключительно для добивания или спасения, а не для фарма стаков.',
      },
      {
        matchId: '7851249301',
        heroId: 41,
        heroName: 'Faceless Void',
        opponent: 'Team Falcons',
        tournament: 'Riyadh Masters 2024',
        date: '2024-07-18',
        csAt10: 79,
        networthAt20: 13600,
        vodTimestamp: '24:10',
        keyTakeaway: 'Постановка Chronosphere по краю, захватывая только ключевую цель (вражеский мидер) без риска задеть союзных героев ближнего боя.',
      },
    ],
    drills: [
      {
        title: 'Упражнение "80 CS на 10-й минуте"',
        difficulty: 'Intermediate',
        objective: 'Добивать крипов в лобби без сопротивления и на линии в рейтинге.',
        howToMeasure: 'Открыть статистику матча и проверить показатель Last Hits на 10:00.',
        targetBenchmark: '>= 75 крипов на 10-й минуте в 4 из 5 рейтинговых игр.',
      },
      {
        title: 'Дисциплина ожидания BKB (Positioning)',
        difficulty: 'Advanced',
        objective: 'Не открывать свою позицию на карте, пока вражеский инициатор (Axe/Mars/Tide) не покажется на миникарте.',
        howToMeasure: 'Количество смертей первой цели в драке должно равняться 0.',
        targetBenchmark: '0 смертей до использования вражеского ультимейта.',
      },
    ],
  },
  {
    id: 'satanic',
    name: 'Satanic',
    team: 'PARIVISION / Team Spirit',
    position: 1,
    country: 'RU',
    signatureHeroes: [10, 94, 18, 1], // Morphling, Medusa, Sven, AM
    skillSpecialties: ['farming', 'itemization'],
    coachingPhilosophy:
      'Максимальная скорость зачистки нейтральных лагерей и расчет таймингов основных предметов с точностью до 30 секунд.',
    notableMatches: [
      {
        matchId: '7920145892',
        heroId: 94,
        heroName: 'Medusa',
        opponent: 'Team Liquid',
        tournament: 'BetBoom Dacha Belgrade 2024',
        date: '2024-10-22',
        csAt10: 88,
        networthAt20: 16100,
        vodTimestamp: '14:20',
        keyTakeaway: 'Стаки древних крипов с помощью Split Shot и быстрая Manta Style на 13:40.',
      },
    ],
    drills: [
      {
        title: 'Паттерн лесного треугольника',
        difficulty: 'Intermediate',
        objective: 'Очищать два лагеря и волну крипов за одну минуту без простоя.',
        howToMeasure: 'GPM за первые 20 минут матча.',
        targetBenchmark: 'GPM >= 750 к 20-й минуте.',
      },
    ],
  },
  {
    id: 'ame',
    name: 'Ame',
    team: 'Xtreme Gaming',
    position: 1,
    country: 'CN',
    signatureHeroes: [95, 67, 10, 44], // Troll, Spectre, Morph, PA
    skillSpecialties: ['laning', 'positioning', 'death_analysis'],
    coachingPhilosophy:
      'Абсолютный контроль крип-крипа на стадии лайнинга: использование агра каждые 3 секунды для безопасного фарминга под своей башней.',
    notableMatches: [
      {
        matchId: '7874912034',
        heroId: 95,
        heroName: 'Troll Warlord',
        opponent: 'Team Spirit',
        tournament: 'Riyadh Masters 2024 Playoffs',
        date: '2024-07-20',
        csAt10: 82,
        networthAt20: 13900,
        vodTimestamp: '06:15',
        keyTakeaway: 'Постоянное перетягивание крипов на своего дальника через клик по вражескому герою на сложной линии.',
      },
    ],
    drills: [
      {
        title: 'Крип-агр на линии (Creep Aggro Pull)',
        difficulty: 'Beginner',
        objective: 'Подтягивать вражеских крипов на безопасное расстояние к своей вышке.',
        howToMeasure: 'Количество полученного урона от вражеского оффлейнера за первые 5 минут.',
        targetBenchmark: 'Менее 400 полученного харасс-урона до 5-й минуты.',
      },
    ],
  },
  {
    id: 'watson',
    name: 'Watson',
    team: 'Gaimin Gladiators',
    position: 1,
    country: 'KZ',
    signatureHeroes: [44, 12, 10, 93], // PA, PL, Morph, Slark
    skillSpecialties: ['positioning', 'farming'],
    coachingPhilosophy:
      'Держи 14 000 MMR за счет чтения движений по карте: если 3 врагов пропали с миникарты, немедленно отойди под обзор варда.',
    notableMatches: [
      {
        matchId: '7819034211',
        heroId: 44,
        heroName: 'Phantom Assassin',
        opponent: 'BetBoom Team',
        tournament: 'DreamLeague Season 23',
        date: '2024-05-25',
        csAt10: 76,
        networthAt20: 14500,
        keyTakeaway: 'Фарм за вражеской тир-2 вышкой только с установленным глубоким вардом в лесу.',
      },
    ],
    drills: [
      {
        title: 'Взгляд на миникарпу раз в 3 секунды',
        difficulty: 'Intermediate',
        objective: 'Мониторить иконки врагов и предугадывать смок-ганки.',
        howToMeasure: 'Количество смертей от ганков в соло-фарме.',
        targetBenchmark: '0 смертей на вражеской половине карты без информации.',
      },
    ],
  },

  // --- POSITION 2: MID ---
  {
    id: 'nisha',
    name: 'Nisha',
    team: 'Team Liquid',
    position: 2,
    country: 'PL',
    signatureHeroes: [13, 106, 17, 74], // Puck, Ember, Storm, Invoker
    skillSpecialties: ['positioning', 'teamfight_decisions', 'laning'],
    coachingPhilosophy:
      'Создавай постоянное давление на боковых линиях с помощью рун ускорения и двойного урона. Заставляй врагов реагировать на твои движения.',
    notableMatches: [
      {
        matchId: '7942180415',
        heroId: 13,
        heroName: 'Puck',
        opponent: 'Gaimin Gladiators',
        tournament: 'The International 2024 Grand Final',
        date: '2024-09-15',
        csAt10: 72,
        networthAt20: 12400,
        vodTimestamp: '12:30',
        keyTakeaway: 'Использование Phase Shift и Illusory Orb для сброса фокуса трех героев и перетягивание драки к союзной вышке.',
      },
    ],
    drills: [
      {
        title: 'Контроль активных рун на 6-й и 8-й минутах',
        difficulty: 'Intermediate',
        objective: 'Пушить пачку крипов на :45 секунде и занимать высоту у точки спавна руны.',
        howToMeasure: 'Процент взятых активных рун (Haste/DD/Invis/Arcane).',
        targetBenchmark: 'Взято >= 70% активных рун в миде.',
      },
    ],
  },
  {
    id: 'malrine',
    name: 'Malr1ne',
    team: 'Team Falcons',
    position: 2,
    country: 'RU',
    signatureHeroes: [98, 120, 23, 76], // Timbersaw, Pangolier, Kunkka, OD
    skillSpecialties: ['laning', 'teamfight_decisions'],
    coachingPhilosophy:
      'Агрессивный доминантный лайнинг: выбивай ресурсы у вражеского мидера до 4-й минуты и ломай первую башню к 10-й минуте.',
    notableMatches: [
      {
        matchId: '7741920311',
        heroId: 98,
        heroName: 'Timbersaw',
        opponent: 'Team Liquid',
        tournament: 'ESL One Birmingham 2024',
        date: '2024-04-28',
        csAt10: 81,
        networthAt20: 13800,
        keyTakeaway: 'Срезание кустов и полное вытеснение противника под его башню без возможности подойти к крипам.',
      },
    ],
    drills: [
      {
        title: 'Харасс и блокада крипов на старте',
        difficulty: 'Advanced',
        objective: 'Удержать точку встречи крипов на своей возвышенности (High Ground).',
        howToMeasure: 'Количество добитых крипов противника на 2-й минуте (Denies).',
        targetBenchmark: '>= 6 добитых союзных крипов (denies) за первые 2 волны.',
      },
    ],
  },

  // --- POSITION 3: OFFLANE ---
  {
    id: 'collapse',
    name: 'Collapse',
    team: 'Team Spirit',
    position: 3,
    country: 'RU',
    signatureHeroes: [97, 2, 104, 55], // Magnus, Axe, LC, Dark Seer
    skillSpecialties: ['teamfight_decisions', 'positioning', 'map_awareness'],
    coachingPhilosophy:
      'Идеальная инициация решает 90% игр в Dota 2. Твое тело — инструмент для зонинга или убийства вражеского керри.',
    notableMatches: [
      {
        matchId: '7398124018',
        heroId: 97,
        heroName: 'Magnus',
        opponent: 'Team Liquid',
        tournament: 'The International 2023',
        date: '2023-10-27',
        csAt10: 68,
        networthAt20: 11200,
        vodTimestamp: '21:10',
        keyTakeaway: 'Скрытный обход через туман войны с Horn Toss + Skewer прямо под тир-2 башню на вражеского кора.',
      },
    ],
    drills: [
      {
        title: 'Удар с блинка без раздумий (Blink + Call / RP)',
        difficulty: 'Advanced',
        objective: 'Мгновенное нажатие кнопки контроля после перемещения без задержки реакции.',
        howToMeasure: 'Задержка между Blink Dagger и способностью (мс).',
        targetBenchmark: '< 150 миллисекунд в боевых условиях.',
      },
    ],
  },
  {
    id: '33',
    name: '33 (Netta Shapira)',
    team: 'Tundra Esports',
    position: 3,
    country: 'IL',
    signatureHeroes: [38, 78, 60, 33], // Beastmaster, Doom, Night Stalker, Enigma
    skillSpecialties: ['itemization', 'map_awareness', 'laning'],
    coachingPhilosophy:
      'Микроконтроль существ и покупка ауровых предметов (Pipe, Crimson, Greaves) дают команде 3000 эффективного здоровья в каждой драке.',
    notableMatches: [
      {
        matchId: '7942180422',
        heroId: 38,
        heroName: 'Beastmaster',
        opponent: 'Gaimin Gladiators',
        tournament: 'The International 2024',
        date: '2024-09-14',
        csAt10: 71,
        networthAt20: 12900,
        keyTakeaway: 'Разведка ястребом (Hawk) ключевых возвышенностей перед заходом на Рошана.',
      },
    ],
    drills: [
      {
        title: 'Тайминг ауры защиты (Pipe / Crimson)',
        difficulty: 'Intermediate',
        objective: 'Собрать Pipe of Insight против магического пика строго до 18:00.',
        howToMeasure: 'Время покупки первого крупного командного предмета.',
        targetBenchmark: 'Pipe / Crimson Guard собран к 17:30.',
      },
    ],
  },

  // --- POSITION 4: SOFT SUPPORT ---
  {
    id: 'crit',
    name: 'Cr1t-',
    team: 'Team Falcons',
    position: 4,
    country: 'DK',
    signatureHeroes: [88, 7, 107, 128], // Nyx, Earthshaker, Earth Spirit, Snapfire
    skillSpecialties: ['map_awareness', 'laning', 'teamfight_decisions'],
    coachingPhilosophy:
      'Четвертая позиция управляет первой половиной игры: стаки, контест рун мудрости и связки с мидером.',
    notableMatches: [
      {
        matchId: '7851249350',
        heroId: 88,
        heroName: 'Nyx Assassin',
        opponent: 'BetBoom Team',
        tournament: 'Riyadh Masters 2024',
        date: '2024-07-19',
        csAt10: 18,
        networthAt20: 7400,
        vodTimestamp: '07:00',
        keyTakeaway: 'Кража вражеской руны мудрости на 07:00 с помощью невидимости Vendetta.',
      },
    ],
    drills: [
      {
        title: 'Контроль Руны Мудрости (Wisdom Rune)',
        difficulty: 'Beginner',
        objective: 'Быть у руны мудрости на 06:55 и не отдавать свою руну.',
        howToMeasure: 'Количество взятых союзных и украденных вражеских рун мудрости.',
        targetBenchmark: 'Взято 100% союзных и >= 1 вражеская за игру.',
      },
    ],
  },
  {
    id: 'xinq',
    name: 'XinQ',
    team: 'Xtreme Gaming',
    position: 4,
    country: 'CN',
    signatureHeroes: [9, 21, 64, 121], // Mirana, Windranger, Jakiro, Grimstroke
    skillSpecialties: ['laning', 'positioning'],
    coachingPhilosophy:
      'Используй углы тумана войны и стрелы из темноты. Назойливый харасс выбивает все фласки у вражеского керри.',
    notableMatches: [
      {
        matchId: '7874912080',
        heroId: 9,
        heroName: 'Mirana',
        opponent: 'Team Spirit',
        tournament: 'Riyadh Masters 2024',
        date: '2024-07-21',
        csAt10: 22,
        networthAt20: 8100,
        keyTakeaway: 'Попадание стрелами (Sacred Arrow) в больших нейтральных крипов для мгновенного золота и опыта.',
      },
    ],
    drills: [
      {
        title: 'Блокировка малого лагеря противника (Camp Blocking)',
        difficulty: 'Beginner',
        objective: 'Блокировать малый лагерь сентри-вардом или телом на 01:00.',
        howToMeasure: 'Процент игр, где вражеский саппорт не смог сделать отвод на 01:15.',
        targetBenchmark: 'Успешный блок в 9 из 10 матчей.',
      },
    ],
  },

  // --- POSITION 5: HARD SUPPORT ---
  {
    id: 'miposhka',
    name: 'Miposhka',
    team: 'Team Spirit',
    position: 5,
    country: 'RU',
    signatureHeroes: [111, 87, 83, 30], // Oracle, Disruptor, Treant, Witch Doctor
    skillSpecialties: ['map_awareness', 'death_analysis', 'laning', 'itemization'],
    coachingPhilosophy:
      'Варды ставятся не для красоты, а для ответа на конкретный вопрос: "Где вражеский мидер?" и "Безопасно ли фармить нашему керри?". Жертвуй собой ради жизни кора.',
    notableMatches: [
      {
        matchId: '7398124099',
        heroId: 111,
        heroName: 'Oracle',
        opponent: 'Gaimin Gladiators',
        tournament: 'The International 2023 Grand Final',
        date: '2023-10-29',
        csAt10: 12,
        networthAt20: 5800,
        wardsPlaced: 28,
        vodTimestamp: '31:20',
        keyTakeaway: 'Своевременный False Promise на керри Morphling с дистанции за деревьями.',
      },
    ],
    drills: [
      {
        title: 'Умный вижн на дефенс и Рошана',
        difficulty: 'Intermediate',
        objective: 'Не ставить варды на стандартные глазики на скалах (где их сразу снимут). Использовать нестандартные точки на земле.',
        howToMeasure: 'Время жизни Observer Ward (не снят сентриком врага).',
        targetBenchmark: 'Среднее время жизни варда >= 5 минут.',
      },
      {
        title: 'Отводы крипов на 01:18 и 01:48',
        difficulty: 'Beginner',
        objective: 'Вовремя стакать и отводить нейтралов для возвращения линии к своей вышке.',
        howToMeasure: 'Количество успешных отводов за первые 7 минут.',
        targetBenchmark: '>= 3 успешных отвода за стадию лайнинга.',
      },
    ],
  },
  {
    id: 'seleri',
    name: 'Seleri',
    team: 'Gaimin Gladiators',
    position: 5,
    country: 'NL',
    signatureHeroes: [66, 58, 84, 112], // Chen, Enchantress, Ogre, Winter Wyvern
    skillSpecialties: ['laning', 'teamfight_decisions'],
    coachingPhilosophy:
      'Агрессивный темп через лесных существ Chen или ранний пуш. Команда должна двигаться вместе с осадной катапультой на 5-й и 10-й минутах.',
    notableMatches: [
      {
        matchId: '7851249399',
        heroId: 66,
        heroName: 'Chen',
        opponent: 'Team Falcons',
        tournament: 'Riyadh Masters 2024',
        date: '2024-07-21',
        csAt10: 34,
        networthAt20: 7100,
        keyTakeaway: 'Захват кентавра и тролля для пуша башни на 05:30 вместе с катапультой.',
      },
    ],
    drills: [
      {
        title: 'Пуш башни под катапульту (Siege Wave)',
        difficulty: 'Intermediate',
        objective: 'Обеспечить заход осадного орудия на башню на 05:00 и 10:00.',
        howToMeasure: 'Количество здоровья вражеской тир-1 вышки к 07:00.',
        targetBenchmark: 'Тир-1 башня сломана или имеет < 30% HP до 08:00.',
      },
    ],
  },
]

export function getProPlayersByPosition(pos: number): ProPlayer[] {
  return PRO_PLAYERS.filter((p) => p.position === pos)
}

export function getProPlayersBySkill(skill: string): ProPlayer[] {
  return PRO_PLAYERS.filter((p) => p.skillSpecialties.includes(skill as any))
}
