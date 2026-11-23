// Anujin Naranbaatar's portfolio.
// The page is drawn with lit-html (bundled next to this file), from the same
// component logic used in the design file.
import { html, render, nothing } from './lit-html.js';

class DCLogic {
  constructor() { this.props = {}; this.state = {}; }
  setState(patch) {
    Object.assign(this.state, typeof patch === 'function' ? patch(this.state) : patch);
    schedule();
  }
}
class Component extends DCLogic {
  constructor(...args) {
    super(...args);
    this.state = { hRegion: null, hProject: null, hCell: null, locked: null, screen: 'home', t: 0, aboutSel: null, aboutHi: null, revealed: [], flipped: {}, aboutBelow: null, exprTab: 'photos', lightbox: null, series: 'lumi' };
  }

  componentDidMount() {
    let reduce = false;
    try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    if (!reduce) this._timer = setInterval(() => this.setState({ t: this.state.t + 1 }), 250);
  }

  componentWillUnmount() {
    clearInterval(this._timer);
    try { if (this._ac) this._ac.close(); } catch (e) {}
  }

  // ---------- Hover sounds ----------
  // Browsers only allow sound after the visitor's first click or tap, so the audio
  // context is started (or resumed) on any click, and tones are skipped until then.
  _audio() {
    try {
      if (!this._ac) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        this._ac = new AC();
      }
      if (this._ac.state === 'suspended') this._ac.resume();
      return this._ac;
    } catch (e) { return null; }
  }

  // A toy xylophone bar: a bright, quick "ting" built from a few sine waves at the
  // uneven overtones of a struck metal bar, each fading at its own speed.
  _bar(freq, { vol = 0.07, delay = 0 } = {}) {
    if (this.state.soundOff) return;
    const ac = this._ac;
    if (!ac || ac.state !== 'running') return;
    try {
      const t0 = ac.currentTime + delay;
      const out = ac.createGain();
      out.gain.setValueAtTime(vol, t0);
      out.connect(ac.destination);
      [[1, 1, 1.1], [2.756, 0.35, 0.45], [5.404, 0.15, 0.2], [8.933, 0.06, 0.1]].forEach(([ratio, amp, decay]) => {
        const osc = ac.createOscillator();
        const g = ac.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * ratio, t0);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(amp, t0 + 0.003);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + decay);
        osc.connect(g);
        g.connect(out);
        osc.start(t0);
        osc.stop(t0 + decay + 0.05);
      });
    } catch (e) {}
  }

  // Like a rainbow toy xylophone: each colored field is its own bar, ordered by color,
  // red lowest through orange, yellow, green, blue and violet.
  _fieldSound(region) {
    const NOTE = { B: 1046.5, BP: 1174.66, BTP: 1318.51, P: 1396.91, TP: 1567.98, T: 1760.0, BT: 1975.53 };
    const f = NOTE[region];
    if (f) this._bar(f);
  }

  // Projects get a quick little run up three bars, like a mallet skipping along.
  _projectSound() {
    this._bar(1046.5, { vol: 0.05 });
    this._bar(1318.51, { vol: 0.05, delay: 0.06 });
    this._bar(1567.98, { vol: 0.06, delay: 0.12 });
  }

  renderVals() {
    const N = 21;
    const BASE = {
      B: { cx: 35, cy: 38, name: 'Business', tag: '#FF7C9A' },
      T: { cx: 65, cy: 38, name: 'Tech', tag: '#5FAEF7' },
      P: { cx: 50, cy: 64, name: 'People', tag: '#5CC46A' }
    };
    const ORDER = ['B', 'T', 'P'];
    // Each field fades from a pale edge to a vivid center; overlaps get their own color families.
    const STOPS = {
      B: ['#FCE6EC', '#FF7C9A', '#F2552C'],
      T: ['#E5EDFB', '#8DBBFF', '#2FA6F2'],
      P: ['#E7F3E1', '#93D27A', '#1DB54A'],
      BT: ['#EEE3FA', '#B48CFF', '#7B4DFF'],
      BP: ['#FFF0D2', '#FFC24D', '#FF8A00'],
      TP: ['#F1F6CF', '#C9DB3A', '#9DBA00'],
      BTP: ['#FFE3A6', '#F7B500', '#F08C00']
    };
    const REGION_TITLES = {
      B: 'Business', T: 'Tech', P: 'People',
      BT: 'Tech + Business', BP: 'Business + People', TP: 'People + Tech',
      BTP: 'Design = Business + Tech + People'
    };
    // Project photos, embedded so the page needs nothing from outside.
    const IMG_UNESCO = 'images/unesco.jpg';
    const IMG_EY = 'images/ey.jpg';
    const IMG_URECA = 'images/ureca.jpg';
    const IMG_SRP = 'images/stanford-research-park.jpg';
    // Luminance photo series, embedded in the page.
    const LUMI = [
      { src: 'images/luminance-1.jpg', alt: 'An empty street with a reversed STOP painted on the road, parked cars and a freeway overpass', wide: false },
      { src: 'images/luminance-2.jpg', alt: 'A woman in headphones leans on a pillar outside a Caltrain station, her dog beside her', wide: false },
      { src: 'images/luminance-3.jpg', alt: 'A street sign covered in stickers and graffiti, hung on a chain-link fence', wide: false },
      { src: 'images/luminance-4.jpg', alt: 'Sunlight through glass doors throws stripes of light across a dark lobby floor', wide: false },
      { src: 'images/luminance-5.jpg', alt: 'Light and shadow on a bathroom wall beside a small window', wide: false },
      { src: 'images/luminance-6.jpg', alt: 'Fallen leaves on a parking space with a faded wheelchair symbol', wide: false },
      { src: 'images/luminance-7.jpg', alt: 'Two frames: commuters waiting under a departures board, and pigeons outside a community garden', wide: true },
      { src: 'images/luminance-8.jpg', alt: 'Two frames: a boy running through bubbles from a street performer’s cart', wide: true },
      { src: 'images/luminance-9.jpg', alt: 'Two men in hats at a bar crowded with bottles and old objects, seen through a window', wide: false }
    ];
    // Legacy Dance Team photo series.
    const LEGACY = [
      { src: 'images/legacy-dance-team-1.jpg', alt: 'A dancer against blue sky, hands reaching up together, a dancer sitting on the grass, and the team posed in sunglasses on the Stanford lawn' },
      { src: 'images/legacy-dance-team-2.jpg', alt: 'Hands stacked in a huddle, a dancer with long braids against the sky, a dancer lowering her sunglasses, and six members standing arms crossed' },
      { src: 'images/legacy-dance-team-3.jpg', alt: 'A dancer mid-step against the sky, a dancer kneeling on a path, the full team on the lawn, and a dancer holding a hand toward the camera' }
    ];
    const IMG_GUNDAA = 'images/ureca-gundaa.jpg';
    const PROJECTS = [
      {
        id: 'ureca', name: 'URECA', sets: 'BTP', x: 54.5, y: 49.5, icon: 'leaf',
        hero: IMG_URECA, heroAlt: 'Green Mongolian steppe with a winding dirt track leading toward a ger and hills', heroPos: '50% 45%',
        title: 'Mongolian Grassland Carbon Readiness Assessment',
        short: 'Is Mongolia ready for grassland carbon markets?',
        line: 'Is Mongolia ready to run credible, scalable grassland carbon projects? A readiness assessment for project developers and policymakers, supported by the Konrad-Adenauer-Stiftung.',
        role: 'Assessment author', year: 'August 2026', place: 'Mongolia', team: 'URECA, with support from the Konrad-Adenauer-Stiftung',
        facts: [
          { n: '6', l: 'pillars of readiness assessed' },
          { n: '46', l: 'criteria, each scored from 1 to 5' },
          { n: '68.9%', l: 'of Mongolia’s rangeland is degraded' },
          { n: '1.8 / 5', l: 'herder participation, the weakest pillar' }
        ],
        did: 'I wrote the readiness assessment, scoring 46 criteria across six pillars.',
        thinking: { title: 'Building the readiness framework', intro: 'To answer one big question, I broke it down until every part could be tested against evidence and scored.', steps: [
          { label: 'Question', t: 'Is Mongolia ready?', d: 'For credible, scalable grassland carbon projects.' },
          { label: 'Break down', t: '6 pillars', d: 'From policy and herder participation to finance and ecology.' },
          { label: 'Break down', t: '25 considerations', d: 'The conditions that shape each pillar.' },
          { label: 'Test', t: '46 criteria', d: 'Each checked against law, policy, research and field data.' },
          { label: 'Score', t: 'From 1 to 5', d: 'Absent, needs improvement, developing, proficient or advanced.' },
          { label: 'Verdict', t: 'Readiness and next steps', d: 'What developers can do now, and what the state must still resolve.' }
        ] },
        links: [
          { title: 'Mongolian Herders: Nature’s Stewards on the Frontline of Climate Change', source: 'URECA', date: 'May 2026', desc: 'The story of Gundaa, a herder in Bayankhongor Province, and three decades of adapting to a changing steppe.', url: 'https://ureca.com/news/mongolian-herders-natures-stewards-on-the-frontline-of-climate-change' }
        ],
        sections: [
          { h: 'Overview', ps: [
            'Mongolia holds 112 million hectares of grassland, some of the largest intact rangelands left in the world. Herds have grown far beyond what the land can carry, driven largely by global cashmere demand, and only 31.1% of monitored rangeland is still classified as non-degraded.',
            'Restoring the land means herders must keep fewer animals, which costs them income in the near term. Carbon markets could close that gap by paying for verified restoration. This assessment asks whether Mongolia is ready to make that work.'
          ] },
          { h: 'Approach', ps: [
            'We assessed readiness across six pillars: policy and regulation, herder participation, measurement and data infrastructure, financial viability, institutional coordination, and ecological suitability. Together they break into 25 considerations and 46 criteria, each scored against law, policy, published research and field data, from absent (1) to advanced (5).'
          ] }
        ]
      },
      {
        id: 'ey', name: 'Ernst & Young', sets: 'B', x: 22, y: 36, icon: 'chart',
        hero: IMG_EY, heroAlt: 'Ulaanbaatar at sunset, with the curved glass Blue Sky Tower beside a busy avenue', heroPos: '50% 62%', heroCredit: 'Photo: Ch. Batzaya Photography',
        title: 'Risk, regulation and tax advisory',
        short: 'Risk, regulation and tax advisory in Mongolia',
        line: 'Business consulting across three engagements, led by a roadmap for the IPOs of Mongolia’s domestic systemically important banks.',
        role: 'Business consulting intern', year: '2025', place: 'Mongolia', team: 'EY advisory team',
        did: 'I took the bank IPO roadmap from desk research to final delivery, and supported two other engagements.',
        facts: [
          { n: '0 to 1', l: 'on the IPO roadmap, from desk research to final delivery' },
          { n: '2', l: 'deliverables: an assessment report and legal and regulatory recommendations' },
          { n: '20 years', l: 'of stock exchange listings researched' },
          { n: '3', l: 'client engagements in banking and mining' }
        ],
        parts: [
          { label: 'Project 1', h: 'Roadmap for systemically important bank IPOs', role: 'Full process, from desk research to final delivery',
            p: 'A roadmap for the IPOs of Mongolia’s domestic systemically important banks and strategies for meeting banking legislation. My main project, and the one I worked on from start to finish.',
            steps: [
              { label: 'Research', t: 'Learn from past bank IPOs', d: 'Desk research on their outcomes and impact, from stock exchange and banking sector data.' },
              { label: 'Assess', t: 'Where the banks stand', d: 'How the systemically important banks measure up against banking legislation.' },
              { label: 'Deliver', t: 'Assessment report', d: 'The first deliverable, setting out the findings.' },
              { label: 'Recommend', t: 'Strategies for compliance', d: 'Legal and regulatory recommendations to close the gaps.' },
              { label: 'Deliver', t: 'Final recommendations', d: 'The second deliverable, handed to the client.' }
            ] },
          { label: 'Project 2', h: 'Risk management review', role: 'Section on local peer banks',
            p: 'An independent review of a major commercial bank’s enterprise risk management framework, benchmarked against Mongolian and international peers. I wrote the section comparing the bank with other Mongolian banks.',
            steps: [
              { label: 'Gather insights', t: 'Interview people', d: 'Conversations to understand how local peer banks manage risk in practice.' },
              { label: 'Recommend', t: 'Turn the data into recommendations', d: 'Bringing what I collected together in the local peer banks section.' }
            ] },
          { label: 'Project 3', h: 'Mining tax reform', role: 'Desk research and analysis',
            p: 'A paper on tax reform options for Mongolia’s mining sector, prepared for an industry association.',
            steps: [
              { label: 'Research', t: 'Gather the evidence', d: 'Information from reports and data sources, analyzed for the paper.' }
            ] }
        ],
        sections: [
          { h: 'Overview', ps: [
            'At EY I worked as a business consulting intern on three engagements for clients in Mongolia’s banking and mining sectors, where decisions turn on regulation, risk and long-term financial health.'
          ] }
        ]
      },
      {
        id: 'srp', name: 'Stanford Research Park', sets: 'BP', x: 40, y: 62, icon: 'building',
        hero: IMG_SRP, heroAlt: 'Aerial view of Stanford Research Park, with solar panels on low buildings among green trees and hills beyond', heroPos: '50% 60%',
        title: 'Assessing The Hub',
        short: 'Using event, survey and usage data to shape The Hub',
        line: 'Analyzing feedback and usage data from The Hub, Stanford Research Park’s community space, to shape its future events, services and communication.',
        role: 'Operations intern', year: 'Summer 2024', place: 'Stanford Research Park, Palo Alto', team: '[Who you worked with]',
        facts: [
          { n: '272', l: 'events analyzed, April 2022 to July 2024' },
          { n: '15,546', l: 'registrations from 4,879 people' },
          { n: '380', l: 'survey responses in one week' },
          { n: '11', l: 'spaces counted every hour for five days' }
        ],
        did: 'I combined five data sources into recommendations for The Hub’s events, services and communication.',
        thinking: { title: 'From data to recommendations', intro: 'Instead of relying on one source, I looked at The Hub from several angles and checked each finding against the others before turning it into a recommendation.', steps: [
          { label: 'Understand', t: 'Learn the background', d: 'The original Hub proposal, past survey results and existing programs.' },
          { label: 'Listen', t: 'Talk to people on site', d: 'Service partners at The Hub and an urban planner.' },
          { label: 'Collect', t: 'Gather five data sources', d: 'Event registrations, a new survey, counts of how each space was used, and app and newsletter data.' },
          { label: 'Analyze', t: 'Look for patterns', d: 'Charts in Python, plus sorting open survey answers by hand.' },
          { label: 'Cross-check', t: 'Test findings against each other', d: 'Each pattern was checked against the other sources before it counted.' },
          { label: 'Recommend', t: 'Turn insights into actions', d: 'Programs and events, facility and services, and communication.' }
        ] },
        sections: [
          { h: 'Overview', ps: [
            'The Hub hosts events and services for the people who work across Stanford Research Park. I analyzed participant feedback and attendance to find trends, areas for improvement and ways to make future events more engaging, so the Hub’s programs match what its community needs.'
          ] },
          { h: 'Approach', ps: [
            'I started with the background, from the original Hub proposal to past survey results. I met the service partners who run The Hub’s food and bike services, and an urban planner who suggested a short survey and hourly counts of how each space is used. I then combined event registrations, the new survey, the usage counts, and app and newsletter data, and analyzed them together in Python.'
          ] }
        ]
      },
      {
        id: 'dior', name: 'UNESCO', sets: 'BP', x: 28, y: 52, icon: 'globe', color: '#B23A6B',
        hero: IMG_UNESCO, heroAlt: 'A woman weaving colorful threads on a backstrap loom outside an adobe house', heroPos: '50% 55%',
        title: 'Adore the Hands',
        short: 'Fair income for women artisans in the Ecuadorian Andes',
        line: 'Helping the women artisans of Pucará Grande, Ecuador, earn a fair, steady income from their craft, so young people choose to learn it.',
        role: 'Project lead', year: '2026–2027', place: 'Pucará Grande, Ecuador', team: 'Tamia, Isha, Mibu and Caroline',
        facts: [
          { n: '10', l: 'women artisans to start' },
          { n: '300', l: 'Kichwa families in the community' },
          { n: '3,200 m', l: 'up in the Andes' },
          { n: '$5', l: 'what buyers offer for a shikra bag' }
        ],
        did: 'I led a team of five, from root cause interviews to a plan for the first fair orders.',
        thinking: { title: 'Root cause analysis', intro: 'We asked “why?” step by step, starting from the problem the community named and using four interviews in Pucará Grande, until we reached a cause we could act on.', steps: [
          { label: 'The problem', t: 'The knowledge may end with this generation', d: 'Most artisans are 65 to 85.' },
          { label: 'Why?', t: 'Fewer people weave, and young people leave', d: 'They see their mothers work hard for little pay, and leaving looks like the only way to earn.' },
          { label: 'Why?', t: 'It doesn’t pay enough to be worth the hours', d: 'Young people weigh it against studying, working or leaving.' },
          { label: 'Why?', t: 'No contracts, and too little demand', d: 'Buyers set the price, and without steady orders artisans can’t risk making stock.' },
          { label: 'Why?', t: 'Informal work, and buyers can’t find them', d: 'No minimum wage covers pay per piece, and they sell by word of mouth.' },
          { label: 'Core problem', t: 'Handicrafts have no fair market', d: 'Artisans spend hours on a piece and can’t sell it at a fair price.' }
        ] },
        sections: [
          { h: 'Overview', ps: [
            'In Pucará Grande, most artisans are between 65 and 85. Young people watch their mothers work hard for little pay, so they leave instead of learning the craft, and the knowledge may end with this generation.'
          ] },
          { h: 'The core problem', ps: [
            'We asked “why?” step by step across four interviews with artisans. The answer kept coming back to one cause: handicrafts have no fair market. Buyers set the price, there are no contracts or steady orders, artisans work outside labour law, and buyers who value handmade work can’t find them.'
          ] },
          { h: 'Our plan', ps: [
            'We focus on three actions that are high impact and feasible in our time: a fair price for every piece, based on hours, materials and a living wage; direct orders from brands, working with the Ethical Fashion Initiative and UNDP; and formal agreements with those brands.',
            'Over three months we go from listening to the first fair orders, aiming for one signed agreement and pay above $5 a shikra. Then we hand the work to the community and replicate the model with Indigenous craft communities in Mexico, Guatemala and Peru.'
          ] }
        ]
      }
    ];

    const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
    const mix = (a, b, q) => a.map((v, i) => Math.round(v + (b[i] - v) * q));
    const css = (c) => 'rgb(' + c.join(',') + ')';
    const ramp = (stops, q) => {
      const s = stops.map(hex);
      return q < 0.5 ? mix(s[0], s[1], q * 2) : mix(s[1], s[2], (q - 0.5) * 2);
    };
    const step = (q, n) => Math.min(1, Math.ceil(q * n) / n);

    const st = this.state;
    const lockedRegion = st.locked && st.locked.kind === 'region' ? st.locked.id : null;

    // Slow breathing geometry, plus the clicked fields growing outward.
    const UNIT = { B: [-0.577, -0.333], T: [0.577, -0.333], P: [0, 0.667] };
    const G = {};
    ORDER.forEach((k, i) => {
      const b = BASE[k];
      const g = lockedRegion && lockedRegion.includes(k) ? (lockedRegion.length === 1 ? 4 : 2) : 0;
      const w = st.t * 0.12 + i * 2.1;
      G[k] = {
        cx: b.cx + g * UNIT[k][0] + 1.4 * Math.sin(w),
        cy: b.cy + g * UNIT[k][1] + 1.4 * Math.cos(w * 0.8),
        r: 30 + g + 1.6 * Math.sin(w * 1.3 + 1)
      };
    });

    const regionAt = (x, y) => ORDER.filter((k) => Math.hypot(x - G[k].cx, y - G[k].cy) <= G[k].r).join('');
    const tagsFor = (sets) => sets.split('').map((k) => ({ name: BASE[k].name, color: BASE[k].tag }));
    const inRegion = (p, region) => region.split('').every((k) => p.sets.includes(k));
    const top = () => { try { window.scrollTo(0, 0); } catch (e) {} };

    const setHoverRegion = (r) => { if (this.state.hRegion !== r) { if (r) this._fieldSound(r); this.setState({ hRegion: r }); } };
    const toggleLock = (r) => {
      const cur = this.state.locked;
      this.setState({ locked: cur && cur.kind === 'region' && cur.id === r ? null : { kind: 'region', id: r } });
    };
    const openProject = (id) => { this.setState({ screen: id, hProject: null, hRegion: null }); top(); };
    const goHome = () => { this.setState({ screen: 'home', locked: null, hRegion: null, hProject: null }); top(); };
    // Back returns to the home screen as it was, with the same field still open.
    const goBack = () => { this.setState({ screen: 'home', hRegion: null, hProject: null, hCell: null }); top(); };
    const goAbout = () => { this.setState({ screen: 'about' }); top(); };

    const hover = st.hProject ? { kind: 'project', id: st.hProject } : (st.hRegion ? { kind: 'region', id: st.hRegion } : null);
    const view = st.locked || hover;
    const isPreview = !st.locked && !!hover;
    const viewProject = view && view.kind === 'project' ? PROJECTS.find((p) => p.id === view.id) : null;
    const activeLetters = !view ? null : (viewProject ? viewProject.sets : view.id);

    // Ripple out from the focused field when something is picked.
    let fx = 50, fy = 46.7;
    if (activeLetters) {
      const ls = activeLetters.split('');
      fx = ls.reduce((s, k) => s + G[k].cx, 0) / ls.length;
      fy = ls.reduce((s, k) => s + G[k].cy, 0) / ls.length;
    }
    const FADE = hex('#F3F1EF');
    const toLin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const toSrgb = (v) => { const s = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055; return Math.max(0, Math.min(255, Math.round(s * 255))); };
    const toLch = (rgb) => {
      const [r, g, b] = rgb.map(toLin);
      const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
      const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
      const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
      const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
      const A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
      const B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
      return [L, Math.hypot(A, B), Math.atan2(B, A)];
    };
    const fromLch = (L, C, h) => {
      const A = C * Math.cos(h), B = C * Math.sin(h);
      const l = Math.pow(L + 0.3963377774 * A + 0.2158037573 * B, 3);
      const m = Math.pow(L - 0.1055613458 * A - 0.0638541728 * B, 3);
      const s = Math.pow(L - 0.0894841775 * A - 1.2914855480 * B, 3);
      return [
        toSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
        toSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
        toSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)
      ];
    };
    // Mix by weight in OKLCH so a blend of two colors stays bright instead of turning muddy.
    const blend = (cols, ws) => {
      let L = 0, C = 0, hx = 0, hy = 0;
      cols.forEach((c, n) => {
        const [l, ch, h] = toLch(c);
        L += l * ws[n]; C += ch * ws[n]; hx += Math.cos(h) * ws[n]; hy += Math.sin(h) * ws[n];
      });
      return fromLch(L, C, Math.atan2(hy, hx));
    };
    const smooth = (e0, e1, v) => { const q = Math.max(0, Math.min(1, (v - e0) / (e1 - e0))); return q * q * (3 - 2 * q); };
    const WHITE = [255, 255, 255];
    const CS = 100 / N;
    // One small changing core in the middle of each overlap.
    const mid = { x: (G.B.cx + G.T.cx + G.P.cx) / 3, y: (G.B.cy + G.T.cy + G.P.cy) / 3 };
    const away = (k, d) => {
      const vx = mid.x - G[k].cx, vy = mid.y - G[k].cy, len = Math.hypot(vx, vy);
      return { x: mid.x + vx / len * d, y: mid.y + vy / len * d };
    };
    const CORES = [
      { ...mid, offset: 0 },
      { ...away('P', 22), offset: 1.7 },
      { ...away('T', 22), offset: 3.4 },
      { ...away('B', 22), offset: 5.1 }
    ];
    const tiles = [];
    // Pixel streams: one-square-wide pulses leave all three labels at the same moment, travel at the same
    // speed over the same number of squares, and meet in the single center square (column 10, row 9).
    const CYCLE = 18;
    const STREAMS = [
      { k: 'B', key: hex('#E63B57'), off: 17, at: (i, j) => (j === 9 && i <= 10 ? i : -1) },
      { k: 'T', key: hex('#1A8FDB'), off: 17, at: (i, j) => (j === 9 && i >= 10 ? N - 1 - i : -1) },
      { k: 'P', key: hex('#16A043'), off: 17, at: (i, j) => (i === 10 && j >= 9 && j <= 19 ? 19 - j : -1) }
    ];
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const x = (i + 0.5) * 100 / N, y = (j + 0.5) * 100 / N;
        // Soft membership: each field fades in over a few units instead of switching on at its edge.
        const parts = ORDER.map((k) => {
          const inside = G[k].r - Math.hypot(x - G[k].cx, y - G[k].cy);
          return { k, m: smooth(-4, 8, inside), depth: Math.max(0, Math.min(1, inside / G[k].r)) };
        });
        const coverage = 1 - parts.reduce((a, p) => a * (1 - p.m), 1);
        let c = WHITE;
        if (coverage > 0.002) {
          const cols = parts.map((p) => ramp(STOPS[p.k], p.depth));
          // Overlaps hold a steady, even mix of the colors on top of each other.
          const ws = parts.map((p) => p.m + 1e-6);
          const sum = ws.reduce((a, b) => a + b, 0);
          c = mix(WHITE, blend(cols, ws.map((v) => v / sum)), coverage);
          if (activeLetters) {
            const act = activeLetters.split('').reduce((a, k) => a * parts[ORDER.indexOf(k)].m, 1);
            c = mix(c, FADE, (st.locked ? 0.82 : 0.55) * (1 - act) * coverage);
          }
          // The pixel under the cursor lights up, with a softer glow on the squares around it.
          // Tiles ease back over 0.3s, so moving the cursor leaves a short fading trail.
          if (st.hCell !== null && st.hCell !== undefined) {
            const dd = Math.max(Math.abs(i - (st.hCell % N)), Math.abs(j - Math.floor(st.hCell / N)));
            const lit = (dd === 0 ? 1 : dd === 1 ? 0.35 : 0) * coverage;
            if (lit > 0.01) c = mix(c, WHITE, 0.3 * lit);
          }
        }
        STREAMS.forEach((sr) => {
          const s = sr.at(i, j);
          if (s < 0) return;
          if (activeLetters && activeLetters !== sr.k) return;
          const d = ((st.t + sr.off) % CYCLE) - s;
          if (d >= 0 && d < 4) c = mix(c, sr.key, 0.9 * (1 - d / 4) * (1 - s / 24));
        });
        tiles.push({
          color: css(c),
          delay: Math.round(Math.hypot(x - fx, y - fy) * 3)
        });
      }
    }

    const labelDefs = [
      { region: 'B', name: 'Business', question: 'Is it viable?', align: 'flex-end', x: 1, y: 45.24, tf: 'translate(-100%, -50%)', start: 0 },
      { region: 'T', name: 'Tech', question: 'Is it feasible?', align: 'flex-start', x: 99, y: 45.24, tf: 'translate(0, -50%)', start: 0.8 },
      { region: 'P', name: 'People', question: 'Is it desirable?', align: 'center', x: 50, y: 103.5, tf: 'translate(-50%, -50%)', start: 1.6 }
    ];
    // Letter colors are driven by the same clock as the grid: a pulse of the key color runs through each word.
    const KEY = { B: '#F2552C', T: '#2FA6F2', P: '#1DB54A' };
    const DARK = hex('#2b2b2b');
    const sec = st.t * 0.25;
    const letterColor = (region, start, n) => {
      const period = region === 'BTP' ? 4 : 3.2;
      const width = region === 'BTP' ? 0.46 : 0.4;
      const p = (((sec - start - n * 0.12) % period) + period) % period / period;
      if (p >= width) return css(DARK);
      const strength = Math.sin(Math.PI * p / width);
      let key;
      if (region === 'BTP') {
        const q = p / width * 2;
        const cs = [hex(KEY.B), hex(KEY.T), hex(KEY.P)];
        key = q < 1 ? mix(cs[0], cs[1], q) : mix(cs[1], cs[2], q - 1);
      } else {
        key = hex(KEY[region]);
      }
      return css(mix(DARK, key, strength));
    };
    const labels = labelDefs.map((l) => {
      const locked = lockedRegion === l.region;
      const on = !activeLetters || l.region.split('').every((k) => activeLetters.includes(k));
      return {
        ...l,
        pressed: locked ? 'true' : 'false',
        color: on ? '#2b2b2b' : '#8a8a8a',
        deco: locked ? 'underline' : 'none',
        scale: locked || st.hRegion === l.region ? 1.12 : 1,
        // Letters light up in the field's key color one after another, then fade back.
        letters: l.name.split('').map((c) => ({ c, color: on ? ({ B: '#E63B57', T: '#1A8FDB', P: '#16A043' })[l.region] : '#8a8a8a' })),
        enter: () => setHoverRegion(l.region),
        leave: () => setHoverRegion(null),
        pick: () => toggleLock(l.region)
      };
    });

    // Each marker takes the mixed color of the fields it sits in, a little deeper so white icons read.
    const markerColor = (sets) => {
      const ks = sets.split('');
      return css(mix(blend(ks.map((k) => hex(STOPS[k][2])), ks.map(() => 1 / ks.length)), [0, 0, 0], 0.18));
    };
    // Pixel icons on a 7 by 7 grid, drawn as one path of unit squares.
    const PIX = {
      leaf: ['0000011', '0001111', '0011110', '0111100', '0111000', '0100000', '1000000'],
      chart: ['0000010', '0000010', '0001010', '0001010', '0101010', '0101010', '0101010'],
      building: ['1111111', '1010101', '1111111', '1010101', '1111111', '1100011', '1100011'],
      globe: ['0011100', '0101010', '1111111', '1001001', '1111111', '0101010', '0011100']
    };
    const pixPath = (rows) => rows.map((row, y) => row.split('').map((ch, x) => (ch === '1' ? 'M' + x + ' ' + y + 'h1v1h-1z' : '')).join('')).join('');
    const TS = 100 / N;
    // Pixel icons for each kind of stage, on the same 7 by 7 grid as the project icons.
    const STEP_PIX = {
      search: ['0111000', '1000100', '1000100', '1000100', '0111000', '0000110', '0000011'],
      check: ['0000000', '0000001', '0000011', '1000110', '1101100', '0111000', '0010000'],
      doc: ['1111100', '1000110', '1011101', '1000001', '1011101', '1000001', '1111111'],
      bulb: ['0011100', '0100010', '0100010', '0100010', '0011100', '0011100', '0001000'],
      talk: ['1111111', '1000001', '1010101', '1000001', '1111111', '0110000', '0100000'],
      question: ['0111100', '1000010', '0000010', '0001100', '0001000', '0000000', '0001000'],
      grid: ['1110111', '1010101', '1110111', '0000000', '1110111', '1010101', '1110111'],
      bars: ['0000001', '0000001', '0000101', '0000101', '0010101', '0010101', '1010101'],
      flag: ['1111100', '1111110', '1111100', '1000000', '1000000', '1000000', '1000000'],
      book: ['1100011', '1010101', '1001001', '1001001', '1001001', '1001001', '1111111'],
      stack: ['0111110', '1000001', '0111110', '1000001', '0111110', '1000001', '0111110'],
      swap: ['0000100', '1111110', '0000100', '0010000', '0111111', '0010000', '0000000'],
      alert: ['0011100', '0011100', '0011100', '0011100', '0001000', '0000000', '0001000'],
      target: ['0111110', '1000001', '1011101', '1010101', '1011101', '1000001', '0111110']
    };
    const STEP_ICON_FOR = {
      'Research': 'search',
      'Assess': 'check',
      'Deliver': 'doc',
      'Recommend': 'bulb',
      'Gather insights': 'talk',
      'Question': 'question',
      'Break down': 'grid',
      'Test': 'check',
      'Score': 'bars',
      'Verdict': 'flag',
      'Understand': 'book',
      'Listen': 'talk',
      'Collect': 'stack',
      'Analyze': 'bars',
      'Cross-check': 'swap',
      'The problem': 'alert',
      'Why?': 'question',
      'Core problem': 'target',
      'Scope': 'target',
      'Plan': 'flag',
      'Benchmark': 'bars'
    };
    const stepIcon = (label) => pixPath(STEP_PIX[STEP_ICON_FOR[label]] || STEP_PIX.target);
    // When an overlap is open, its name appears beside the diagram, between its two labels,
    // in the mix of their two colors.
    const LABEL_HEX = { B: '#E63B57', T: '#1A8FDB', P: '#16A043' };
    const pairLabels = [
      { region: 'BT', name: 'Tech + Business', x: 50, y: -3.5 },
      { region: 'BP', name: 'Business + People', x: 12, y: 92 },
      { region: 'TP', name: 'People + Tech', x: 88, y: 92 }
    ].map((pl) => {
      const shown = !!(view && view.kind === 'region' && view.id === pl.region);
      const ks = pl.region.split('');
      return {
        ...pl,
        color: css(mix(blend(ks.map((k) => hex(LABEL_HEX[k])), [0.5, 0.5]), [0, 0, 0], 0.12)),
        opacity: shown ? 1 : 0,
        hidden: shown ? 'false' : 'true'
      };
    });

    const dots = PROJECTS.map((p, i) => {
      let on = true;
      if (viewProject) on = p.id === viewProject.id;
      else if (view) on = inRegion(p, view.id);
      return {
        name: p.name, x: p.x, y: p.y,
        left: Math.floor(p.x / TS) * TS,
        top: Math.floor(p.y / TS) * TS,
        size: TS,
        icon: pixPath(PIX[p.icon]),
        fl: 'fl' + i,
        scale: st.hProject === p.id ? 1.15 : 1,
        // The marker is the pixel it sits on: it takes that tile's live color, so it changes with the grid.
        fill: tiles[Math.floor(p.y / TS) * N + Math.floor(p.x / TS)].color,
        delay: tiles[Math.floor(p.y / TS) * N + Math.floor(p.x / TS)].delay,
        iconColor: on ? '#fff' : 'rgba(0,0,0,0.35)',
        color: on ? '#222' : '#bdbdbd',
        textColor: on ? '#222' : '#767676',
        isLeaf: p.icon === 'leaf', isChart: p.icon === 'chart', isBuilding: p.icon === 'building', isGlobe: p.icon === 'globe',
        enter: () => { if (this.state.hProject !== p.id) { this._projectSound(); this.setState({ hProject: p.id }); } },
        leave: () => this.setState({ hProject: null }),
        open: () => openProject(p.id)
      };
    });

    // ---------- About me: a pixel portrait whose features each hold one part of the story ----------
    const PW = 28, PH = 36;
    // Features that open a section under the portrait: Expression shows photographs, What I love shows
    // the insights, Learning shows the classes.
    const BELOW = ['mouth', 'heart', 'hands'];
    const ABOUT = [
      { id: 'sys', part: 'Brain', title: 'Systems thinking', color: '#1A8FDB',
        body: 'Mapping the whole system leads to a better long-term mission.' },
      { id: 'des', part: 'Brain', title: 'Design thinking', color: '#E63B57',
        body: 'Designing with people, for people, and with purpose.' },
      { id: 'eyes', part: 'Eyes', title: 'My vision', color: '#7A4A2B',
        body: 'To build responsible, lasting business models for climate and livelihoods.' },
      { id: 'nose', part: 'Nose', title: 'Curiosity', color: '#D9822B',
        body: 'Next, I want to learn how carbon pricing and climate-beneficial fiber can create lasting value.' },
      { id: 'mouth', part: 'Mouth', title: 'Expression', color: '#B23A6B',
        body: 'I share what I experience through writing and photography.' },
      { id: 'heart', part: 'Heart', title: 'What I love', color: '#D7263D',
        body: 'Asking why, mapping things, and the aha moment in an interview.' },
      { id: 'hands', part: 'Hands', title: 'Learning', color: '#C9962B',
        body: 'What I’m studying at Stanford right now.' }
    ];
    if (!this._portrait3) {
      const cells = [];
      const ell = (u, v, cx, cy, rx, ry) => ((u - cx) / rx) ** 2 + ((v - cy) / ry) ** 2 <= 1;
      const hash = (x, y) => { const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return h - Math.floor(h); };
      const pick = (arr, x, y) => arr[Math.floor(hash(x, y) * arr.length)];
      const HAIR = ['#4A2A1E', '#56301F', '#5E3522'];
      const HAIR_LIGHT = ['#8A4A2A', '#A0552F'];
      const SKIN = ['#F4CDA8', '#F0C49C', '#F6D4B3'];
      const SWEATER = ['#EFE6D2', '#E8DDC4', '#F3ECDD'];
      const SYS = ['#1A8FDB', '#4FA9E8', '#2F9BE0'];
      const DES = ['#E63B57', '#F0708A', '#EB566F'];
      const HAND = ['#EDBE96', '#F0C49C'];
      const HAND_LINE = '#B07A55';
      // straight hair: soft vertical streaks
      const hairAt = (x, y) => (x % 4 === 1 && y < 27 ? pick(HAIR_LIGHT, x, y) : pick(HAIR, x, y));
      // peace sign, raised on the right (6 wide, 9 tall, from x 20, y 18): 1 skin, 2 outline
      const PEACE = ['100010', '100010', '100010', '010100', '010100', '222220', '211112', '211112', '022220'];
      // fist holding a pencil, lower left (8 wide, 9 tall, from x 1, y 26): 1 skin, 2 outline, e eraser, p pencil, w wood, g graphite
      const PENCIL = ['e0000000', '0p000000', '00p00000', '0222p200', '02111p20', '02121120', '02111120', '00222w20', '0000000g'];
      for (let y = 0; y < PH; y++) {
        for (let x = 0; x < PW; x++) {
          const u = x + 0.5, v = y + 0.5, du = Math.abs(u - 14);
          let c = null, part = null, blinkC = null, hk = null;
          if (v >= 27 && du <= Math.min(12.5, 6 + (v - 27) * 1.6)) c = pick(SWEATER, x, y);
          // hair: rounded crown, then straight sides with a level cut
          if (ell(u, v, 14, 14, 10.6, 10.8) || (v >= 13 && v < 29 && du <= 10.6)) c = hairAt(x, y);
          if (u >= 12 && u < 16 && v >= 23 && v < 28) c = pick(SKIN, x, y);
          if (v >= 27 && v < 29 && du > 3 && du <= 6.6) c = pick(SWEATER, x, y);
          if (ell(u, v, 14, 16.2, 6.6, 7.8)) c = pick(SKIN, x, y);
          // straight bangs
          if (v >= 8 && v < 11 && du <= 6.4) c = hairAt(x, y);
          // the brain on the crown, in two halves with folds
          if (v < 10 && ell(u, v, 14, 7.6, 8.4, 5.8)) {
            const left = u < 14;
            part = left ? 'sys' : 'des';
            const fold = Math.sin(u * 2.3 + v * 1.4) + Math.sin(v * 2.1 - u * 0.9);
            c = (x === 13 || x === 14) && y >= 3 ? (left ? '#127ABF' : '#C92E49') : fold > 1.1 ? (left ? '#8DC4F0' : '#F7A6B6') : pick(left ? SYS : DES, x, y);
          }
          // brows
          if (y === 13 && ((x >= 9 && x <= 11) || (x >= 16 && x <= 18))) { c = '#3E2419'; part = null; }
          // eyes: lashes, a white catchlight, brown irises
          for (const ex of [10, 16]) {
            if (x >= ex && x <= ex + 1 && y >= 14 && y <= 16) {
              const skin = pick(SKIN, x, y);
              part = 'eyes';
              if (y === 14) { c = '#2B1B16'; blinkC = skin; }
              else if (y === 15) { c = x === ex ? '#FFFFFF' : '#5A3220'; blinkC = skin; }
              else { c = '#7A4A2B'; blinkC = '#2B1B16'; }
            }
          }
          // nose
          if ((y === 18 && (x === 13 || x === 14)) || (y === 17 && x === 14)) { c = y === 17 ? '#E9AE80' : '#D9822B'; part = 'nose'; }
          // cheeks
          if (y === 19 && (x === 9 || x === 10 || x === 17 || x === 18)) c = '#F3A3A3';
          // mouth
          if ((y === 20 && x >= 12 && x <= 15) || (y === 21 && (x === 13 || x === 14))) { c = y === 20 ? '#B23A6B' : '#D46B92'; part = 'mouth'; }
          // heart on the chest: a classic pixel heart, 7 wide and 6 tall (h highlight, r red, d shadow)
          const HEART_PX = ['0rr0rr0', 'rhrrrrr', 'rrrrrrr', '0rrrrd0', '00rrd00', '000d000'];
          if (x >= 11 && x <= 17 && y >= 28 && y <= 33) {
            const k = HEART_PX[y - 28][x - 11];
            if (k !== '0') { c = k === 'h' ? '#F7A6B6' : k === 'd' ? '#B81E33' : '#D7263D'; part = 'heart'; }
          }
          // hands: a peace sign on the right, a pencil in the left
          if (x >= 20 && x < 26 && y >= 18 && y < 27) {
            const k = PEACE[y - 18][x - 20];
            if (k !== '0') { c = k === '2' ? HAND_LINE : pick(HAND, x, y); part = 'hands'; hk = k; }
          }
          if (x >= 1 && x < 9 && y >= 26 && y < 35) {
            const k = PENCIL[y - 26][x - 1];
            const map = { '1': pick(HAND, x, y), '2': HAND_LINE, e: '#F08AA0', p: '#F2C230', w: '#E8B97A', g: '#3B2620' };
            if (k !== '0') { c = map[k]; part = 'hands'; hk = k; }
          }
          cells.push({ c, part, blinkC, hk });
        }
      }
      // Sort every plain pixel into hair, skin, sweater or brow, then mark the pixels on the edge of
      // each area; those edges draw the skeleton outline before the portrait is filled in.
      const kindOf = (cell) => {
        if (!cell.c) return 'empty';
        if (cell.part) return 'feature';
        if (HAIR.includes(cell.c) || HAIR_LIGHT.includes(cell.c)) return 'hair';
        if (SWEATER.includes(cell.c)) return 'sweater';
        if (cell.c === '#3E2419') return 'brow';
        return 'skin';
      };
      cells.forEach((cell) => { cell.kind = kindOf(cell); });
      cells.forEach((cell, i) => {
        if (cell.kind === 'empty' || cell.kind === 'feature') return;
        const x = i % PW, y = Math.floor(i / PW);
        const at = (xx, yy) => (xx < 0 || yy < 0 || xx >= PW || yy >= PH ? 'empty' : cells[yy * PW + xx].kind);
        cell.edge = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([ox, oy]) => {
          const k = at(x + ox, y + oy);
          return k !== 'feature' && k !== cell.kind;
        });
      });
      // The skeleton the portrait starts from: skull, spine, collarbones, ribs and arm bones,
      // with sockets, a nasal cavity and teeth where the features will go.
      const BONE = ['#EDE8DD', '#E6E0D3'];
      const BONE_LINE = '#9A948A';
      const THIN = '#C9C1B1';
      const CAVITY = '#3A3633';
      const skullAt = (xx, yy) => {
        const uu = xx + 0.5, vv = yy + 0.5;
        return ell(uu, vv, 14, 10.6, 8.6, 8.6) || ell(uu, vv, 14, 18.6, 5.6, 4.4);
      };
      const line = (x0, y0, x1, y1) => {
        const pts = [];
        const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
        for (let k = 0; k <= n; k++) pts.push([Math.round(x0 + (x1 - x0) * k / n), Math.round(y0 + (y1 - y0) * k / n)]);
        return pts;
      };
      const thin = new Set();
      [[20, 27, 24, 31], [24, 31, 23, 27], [7, 27, 5, 29]].forEach(([a0, b0, a1, b1]) => line(a0, b0, a1, b1).forEach(([xx, yy]) => thin.add(yy * PW + xx)));
      cells.forEach((cell, i) => {
        const x = i % PW, y = Math.floor(i / PW), u = x + 0.5, du = Math.abs(u - 14);
        let sk = null;
        if (skullAt(x, y)) {
          const edge = !skullAt(x + 1, y) || !skullAt(x - 1, y) || !skullAt(x, y + 1) || !skullAt(x, y - 1);
          sk = edge ? BONE_LINE : pick(BONE, x, y);
        }
        if (!sk) {
          if ((x === 13 || x === 14) && y >= 23) sk = y % 2 === 0 ? THIN : BONE_LINE;
          else if (y === 26 && du >= 1.5 && du <= 8.5) sk = THIN;
          else if ((y === 28 || y === 30 || y === 32 || y === 34) && du >= 1.5 && du <= 7.5 - (y - 28) * 0.25) sk = THIN;
          else if (thin.has(i)) sk = THIN;
        }
        if ((cell.part === 'sys' || cell.part === 'des') && sk && sk !== BONE_LINE && (x === 13 || x === 14)) sk = '#B5AE9F';
        if (cell.part === 'eyes' || cell.part === 'nose') sk = CAVITY;
        if (cell.part === 'mouth') sk = y === 20 ? (x % 2 === 0 ? '#FFFFFF' : '#BDB6A8') : CAVITY;
        if (cell.part === 'heart' && !sk) sk = '#EFE9DE';
        if (cell.part === 'hands') sk = cell.hk === '1' ? pick(BONE, x, y) : cell.hk === '2' ? BONE_LINE : cell.c;
        cell.skel = sk;
      });
      this._portrait3 = cells;
    }
    const aboutFocus = st.aboutHi || st.aboutSel;
    const blink = st.t % 22 === 0;
    // The portrait starts as a skeleton. Each feature fills in when it's clicked, and once all seven
    // are in, the hair, skin and blush fill in too, row by row from the top.
    const revealed = st.revealed || [];
    const complete = ABOUT.every((ab) => revealed.includes(ab.id));
    const portrait = this._portrait3.map((cell, i) => {
      let col;
      let d = 0;
      if (cell.part && revealed.includes(cell.part)) {
        col = hex(blink && cell.blinkC ? cell.blinkC : cell.c);
      } else if (complete && cell.c) {
        col = hex(cell.c);
        d = Math.floor(i / PW) * 35;
      } else if (!complete && cell.skel) {
        col = hex(cell.skel);
      } else {
        return { c: 'rgba(255,255,255,0)', d: complete ? Math.floor(i / PW) * 35 : 0 };
      }
      if (aboutFocus && !complete && cell.part !== aboutFocus) col = mix(col, [255, 255, 255], 0.6);
      return { c: css(col), d };
    });
    const reveal = (part) => {
      const done = this.state.revealed || [];
      if (!part || done.includes(part)) return;
      const next = [...done, part];
      // The last feature completes the portrait: clear the selection so the whole picture shows at full color.
      if (ABOUT.every((ab) => next.includes(ab.id))) this.setState({ revealed: next, aboutSel: null, aboutHi: null, aboutBelow: null });
      else this.setState({ revealed: next });
    };
    const portraitAt = (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      const x = Math.floor((e.clientX - r.left) / r.width * PW), y = Math.floor((e.clientY - r.top) / r.height * PH);
      if (x < 0 || y < 0 || x >= PW || y >= PH) return null;
      return this._portrait3[y * PW + x].part;
    };
    const onPortraitMove = (e) => {
      const part = portraitAt(e);
      if (part !== this.state.aboutHi) this.setState({ aboutHi: part });
    };
    const onPortraitLeave = () => this.setState({ aboutHi: null });
    const onPortraitClick = (e) => {
      if (e.detail === 0) return;
      const part = portraitAt(e);
      if (part) { this.setState(BELOW.includes(part) ? { aboutSel: part, aboutBelow: part } : { aboutSel: part }); reveal(part); }
    };
    // Callout layout in a 1000 by 520 frame: the portrait fills the middle, cards sit on both sides,
    // and a line runs from each card to its feature on the portrait.
    const CALLOUT = {
      sys: { side: 'L', top: 30, cell: [9, 6] },
      eyes: { side: 'L', top: 150, cell: [10, 15] },
      nose: { side: 'L', top: 270, cell: [13, 18] },
      hands: { side: 'L', top: 395, cell: [4, 30] },
      des: { side: 'R', top: 30, cell: [18, 6] },
      mouth: { side: 'R', top: 200, cell: [15, 20] },
      heart: { side: 'R', top: 360, cell: [16, 30] }
    };
    const cellPoint = ([cx, cy]) => [320 + (cx + 0.5) * (360 / 28), 28.5 + (cy + 0.5) * (463 / 36)];
    const aboutLines = ABOUT.map((ab) => {
      const co = CALLOUT[ab.id];
      const [fx, fy] = cellPoint(co.cell);
      const ay = co.top + 20;
      const shown = revealed.includes(ab.id) || complete;
      const lit = shown || st.aboutHi === ab.id;
      const pts = co.side === 'L' ? `300,${ay} 330,${ay} ${fx.toFixed(1)},${fy.toFixed(1)}` : `700,${ay} 670,${ay} ${fx.toFixed(1)},${fy.toFixed(1)}`;
      return { pts, fx: fx.toFixed(1), fy: fy.toFixed(1), color: lit ? ab.color : '#C8C8C8', dash: shown ? 'none' : '3 3' };
    });
    const aboutRows = ABOUT.map((ab) => {
      const open = complete || revealed.includes(ab.id);
      return {
        ...ab,
        open,
        expanded: open ? 'true' : 'false',
        weight: open || st.aboutHi === ab.id ? '600' : '400',
        hasList: !!(ab.list && ab.list.length),
        listText: (ab.list || []).join(', '),
        top: (CALLOUT[ab.id].top / 520 * 100).toFixed(2),
        left: CALLOUT[ab.id].side === 'L' ? '0%' : 'auto',
        right: CALLOUT[ab.id].side === 'R' ? '0%' : 'auto',
        align: CALLOUT[ab.id].side === 'L' ? 'right' : 'left',
        dir: CALLOUT[ab.id].side === 'L' ? 'row-reverse' : 'row',
        list: ab.list || [],
        hasProjects: !!(ab.projects && ab.projects.length),
        projects: (ab.projects || []).map((pj) => ({ n: pj.n, linked: !!pj.id, plain: !pj.id, open: () => { if (pj.id) openProject(pj.id); } })),
        enter: () => { if (this.state.aboutHi !== ab.id) this.setState({ aboutHi: ab.id }); },
        leave: () => this.setState({ aboutHi: null }),
        pick: () => { this.setState(BELOW.includes(ab.id) ? { aboutSel: this.state.aboutSel === ab.id ? null : ab.id, aboutBelow: ab.id } : { aboutSel: this.state.aboutSel === ab.id ? null : ab.id }); reveal(ab.id); }
      };
    });

    // ---------- Thank-you section: pixel flashcards (from the Teach One Figma file) and quotes ----------
    const ICON9 = (fn) => { const rows = []; for (let y = 0; y < 9; y++) { let r = ''; for (let x = 0; x < 9; x++) r += fn(x, y); rows.push(r); } return rows; };
    const FLASH_ICONS = {
      need: ['....1....', '...111...', '..11111..', '222222222', '.3333333.', '333333333', '.3333333.', '..33333..', '...333...'],
      far: ['...333...', '..3...3..', '.3.....3.', '11.....22', '111...222', '111...222', '.1.....2.', '.........', '.........'],
      edges: ['3.......3', '33.....33', '.........', '1.2.2.2.1', '111222111', '1.2.2.2.1', '1.2.2.2.1', '.........', '333333333'],
      gap: ['1111.....', '1..1.....', '1111.....', '.1.......', '.........', '.....2222', '.....2222', '.....2222', '33333.333'],
      rules: ['121212..3', '212121.33', '121212.3.', '212121...', '121212...', '212121...', '.........', '.........', '.........'],
      remix: ICON9((x, y) => { const a = Math.hypot(x - 3, y - 4) <= 2.7, b = Math.hypot(x - 5.2, y - 4) <= 2.7; return a && b ? '3' : a ? '1' : b ? '2' : '.'; }),
      scrappy: ['.1.....1.', '..1...1..', '1111111..', '1..2..1..', '1..2..1..', '1..2..1..', '1111111..', '.........', '.........'],
      reframe: ['....3....', '...1.2...', '...1.2...', '..1...2..', '..1...2..', '.1.....2.', '.1.....2.', '1.......2', '.........']
    };
    const FLASH = [
      { id: 'need', title: 'Understand the real need', accent: '#1A8FDB', pal: { 1: '#BFDDF5', 2: '#1A8FDB', 3: '#4FA9E8' },
        desc: 'Look past what people ask for to the need underneath.',
        example: 'Commuters didn’t want a tastier milkshake. They wanted something to last a long, boring drive.' },
      { id: 'far', title: 'Borrow from far away', accent: '#16A043', pal: { 1: '#16A043', 2: '#93D27A', 3: '#2b2b2b' },
        desc: 'Your problem may already be solved in another field.',
        example: 'Japan’s bullet train lost its tunnel boom when engineers copied the kingfisher’s beak.' },
      { id: 'edges', title: 'Learn from the edges', accent: '#E63B57', pal: { 1: '#E63B57', 2: '#BDBDBD', 3: '#F7A6B6' },
        desc: 'Study extreme users, because their needs are easier to see.',
        example: 'Curb cuts made for wheelchair users now help strollers, suitcases and skateboards too.' },
      { id: 'gap', title: 'Mind the say–do gap', accent: '#D9822B', pal: { 1: '#D9822B', 2: '#2b2b2b', 3: '#F2C230' },
        desc: 'Watch what people do, not just what they say.',
        example: 'Shoppers said price mattered most, then chose cooling devices by brand and looks.' },
      { id: 'rules', title: 'Rule maker, rule breaker', accent: '#7B4DFF', pal: { 1: '#D9CCFF', 2: '#7B4DFF', 3: '#E63B57' },
        desc: 'List the unspoken rules, then break them.',
        example: 'Break every rule of a hotel and you get something like Airbnb.' },
      { id: 'remix', title: 'Remix at the edge', accent: '#B23A6B', pal: { 1: '#F7A6B6', 2: '#8DC4F0', 3: '#B23A6B' },
        desc: 'Mash your idea up with a completely different world.',
        example: 'HIV prevention met the beauty industry: medicine hidden in cases that look like lipstick.' },
      { id: 'scrappy', title: 'Get scrappy', accent: '#C9962B', pal: { 1: '#C9962B', 2: '#E8D3A3', 3: '#2b2b2b' },
        desc: 'Make the roughest version fast, and learn from it.',
        example: 'A one-day cardboard cutout taught a Sesame Street team more than months of specs.' },
      { id: 'reframe', title: 'Reframe the question', accent: '#2FA6F2', pal: { 1: '#1A8FDB', 2: '#E63B57', 3: '#F2C230' },
        desc: 'Ask why to find the real need, then how to meet it.',
        example: '“Sell life insurance to millennials” became a coffee shop and supper club for grownups.' }
    ];
    const DRAW = {
      need: { fill: 'M30 32 L90 32 L104 54 L80 74 L40 74 L16 54 Z', line: 'M4 32 H116 M46 32 L60 12 L74 32' },
      far: { fill: 'M10 54 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0 M82 54 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0', line: 'M92 38 C82 6 38 6 28 38 M28 38 l-7 -7 M28 38 l9 -3' },
      edges: { fill: 'M14 30 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M94 30 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0', line: 'M40 32 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 M55 32 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 M70 32 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 M20 40 V64 M45 40 V64 M60 40 V64 M75 40 V64 M100 40 V64 M6 64 H114' },
      gap: { fill: 'M72 40 H112 V72 H72 Z', line: 'M8 8 H54 V34 H26 L18 42 V34 H8 Z M58 56 H68 M58 56 l5 -4 M58 56 l5 4 M68 56 l-5 -4 M68 56 l-5 4' },
      rules: { fill: 'M92 18 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0', line: 'M8 22 H56 V70 H8 Z M20 22 V70 M32 22 V70 M44 22 V70 M8 34 H56 M8 46 H56 M8 58 H56 M62 46 C76 46 82 32 90 24 M90 24 l-9 1 M90 24 l-1 9' },
      remix: { fill: 'M60 18 A26 26 0 0 1 60 62 A26 26 0 0 1 60 18 Z', line: 'M20 40 a26 26 0 1 0 52 0 a26 26 0 1 0 -52 0 M48 40 a26 26 0 1 0 52 0 a26 26 0 1 0 -52 0' },
      scrappy: { fill: 'M30 34 H86 V72 H30 Z', line: 'M30 34 L18 22 M86 34 L98 22 M30 34 L44 22 H72 L86 34 M58 34 V72' },
      reframe: { fill: 'M54 14 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0', line: 'M8 72 L56 20 M64 20 L112 72 M30 48 l1 -9 M30 48 l8 -2 M90 48 l-1 9 M90 48 l-8 2' }
    };
    const layersOf = (rows, pal) => Object.keys(pal).map((k) => ({
      color: pal[k],
      d: rows.map((row, y) => row.split('').map((ch, x) => (ch === k ? 'M' + x + ' ' + y + 'h1v1h-1z' : '')).join('')).join('')
    })).filter((ly) => ly.d);
    const flashcards = FLASH.map((fc, n) => {
      const flipped = !!(st.flipped || {})[fc.id];
      return {
        ...fc,
        num: String(n + 1).padStart(2, '0') + ' / ' + FLASH.length,
        tint: css(mix(hex(fc.accent), [255, 255, 255], 0.9)),
        layers: layersOf(FLASH_ICONS[fc.id], fc.pal),
        fillD: DRAW[fc.id].fill, lineD: DRAW[fc.id].line,
        soft: css(mix(hex(fc.accent), [255, 255, 255], 0.45)),
        isCard: true, isQuote: false,
        turn: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        pressed: flipped ? 'true' : 'false',
        flip: () => this.setState({ flipped: { ...(this.state.flipped || {}), [fc.id]: !flipped } })
      };
    });
    const quotes = [
      { text: 'We can’t control systems or figure them out. But we can dance with them.', who: 'Donella Meadows', accent: '#1A8FDB' },
      { text: 'Everyone designs who devises courses of action aimed at changing existing situations into preferred ones.', who: 'Herbert Simon', accent: '#E63B57' },
      { text: 'The future is already here. It’s just not very evenly distributed.', who: 'William Gibson', accent: '#16A043' },
      { text: 'A decision is an irrevocable allocation of resources: not just a mental commitment, but a real pursuit of action.', who: 'Ronald A. Howard', accent: '#C9962B' }
    ];
    // Mix them: two cards, then a quote, repeated.
    const insights = [];
    flashcards.forEach((fc, n) => {
      insights.push(fc);
      if (n % 2 === 1 && quotes[(n - 1) / 2]) insights.push({ ...quotes[(n - 1) / 2], isCard: false, isQuote: true });
    });

    const pointRegion = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      return regionAt((e.clientX - rect.left) / rect.width * 100, (e.clientY - rect.top) / rect.height * 100);
    };
    const onMove = (e) => {
      // Over a field label, the label's own hover decides what shows; don't let the pointer position override it.
      if (e.target && e.target.closest && e.target.closest('[data-label]')) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width * 100, py = (e.clientY - rect.top) / rect.height * 100;
      const cell = px >= 0 && py >= 0 && px < 100 && py < 100 ? Math.floor(py / CS) * N + Math.floor(px / CS) : null;
      const r = regionAt(px, py) || null;
      if (r && r !== this.state.hRegion) this._fieldSound(r);
      if (r !== this.state.hRegion || cell !== this.state.hCell) this.setState({ hRegion: r, hCell: cell });
    };
    const onLeave = () => this.setState({ hRegion: null, hProject: null, hCell: null });
    const onLayerClick = (e) => {
      if (e.detail === 0) { this.setState({ locked: null }); return; }
      const key = pointRegion(e);
      if (key) toggleLock(key);
      else this.setState({ locked: null });
    };

    const isRegion = view && view.kind === 'region';
    const matched = isRegion ? PROJECTS.filter((p) => inRegion(p, view.id)) : [];

    const pageProject = PROJECTS.find((p) => p.id === st.screen) || null;
    const nextProject = pageProject ? PROJECTS[(PROJECTS.indexOf(pageProject) + 1) % PROJECTS.length] : null;
    const screenKey = pageProject ? 'project' : st.screen;
    const navItems = [
      { name: 'Home', key: 'home', go: goHome },
      { name: 'About me', key: 'about', go: goAbout }
    ].map((n) => ({ ...n, color: n.key === screenKey ? '#000' : '#5f5f5f', deco: n.key === screenKey ? 'underline' : 'none' }));

    return {
      navItems, goHome, goBack,
      soundPressed: st.soundOff ? 'false' : 'true',
      soundLabel: st.soundOff ? 'Turn sound on' : 'Turn sound off',
      soundIcon: (st.soundOff
        ? ['...1.....', '..11.....', '1111.1.1.', '1111..1..', '1111.1.1.', '..11.....', '...1.....', '.........', '.........']
        : ['...1...1.', '..11.1..1', '1111..1.1', '1111..1.1', '1111..1.1', '..11.1..1', '...1...1.', '.........', '.........']
      ).map((row, y) => row.split('').map((ch, x) => (ch === '1' ? 'M' + x + ' ' + (y + 1) + 'h1v1h-1z' : '')).join('')).join(''),
      toggleSound: () => { this._audio(); this.setState({ soundOff: !this.state.soundOff }); },
      // A click anywhere on the page outside the diagram (and not on a button) closes the open field
      // and brings back the starting view.
      onPageClick: (e) => {
        this._audio();
        const el = e.target;
        if (el && el.closest && (el.closest('[data-keep]') || el.closest('button') || el.closest('a'))) return;
        if (this.state.screen === 'home' && this.state.locked) this.setState({ locked: null, hRegion: null, hProject: null });
        if (this.state.screen === 'about' && (this.state.aboutSel || this.state.aboutHi)) this.setState({ aboutSel: null, aboutHi: null });
      },
      showHome: st.screen === 'home',
      showAboutPage: st.screen === 'about',
      portrait, aboutRows, aboutLines, onPortraitMove, onPortraitLeave, onPortraitClick, flashcards, quotes, insights,
      contactLinks: [
        { label: 'Email', value: 'anujin@stanford.edu', href: 'mailto:anujin@stanford.edu' },
        { label: 'LinkedIn', value: 'Anujin Naranbaatar', href: 'https://www.linkedin.com/in/anujin-naranbaatar-78569325b/' }
      ].map((ct) => ({ ...ct, linked: !!ct.href, plain: !ct.href })),
      belowInsights: st.aboutBelow === 'heart',
      belowPhotos: st.aboutBelow === 'mouth',
      belowLearning: st.aboutBelow === 'hands',
      lumiSingles: LUMI.map((ph, n) => ({ ...ph, n })).filter((ph) => !ph.wide).map((ph) => ({ ...ph, open: () => this.setState({ lightbox: ph.n }) })),
      lumiWide: LUMI.map((ph, n) => ({ ...ph, n })).filter((ph) => ph.wide).map((ph) => ({ ...ph, open: () => this.setState({ lightbox: ph.n }) })),
      // A loose, collage-like arrangement: each photo gets its own width, offset and drop.
      lumiMessy: [
        { n: 0, w: 44, ml: 0, mt: 0, z: 1 },
        { n: 1, w: 30, ml: -4, mt: 70, z: 2 },
        { n: 2, w: 20, ml: 6, mt: 150, z: 1 },
        { n: 5, w: 22, ml: 6, mt: -70, z: 3 },
        { n: 3, w: 38, ml: -3, mt: 30, z: 2 },
        { n: 4, w: 22, ml: 4, mt: 120, z: 1 },
        { n: 6, w: 58, ml: 2, mt: -30, z: 1 },
        { n: 8, w: 40, ml: -6, mt: 60, z: 3 },
        { n: 7, w: 66, ml: 22, mt: -50, z: 2 }
      ].map((pos) => ({ ...LUMI[pos.n], ...pos, open: () => this.setState({ lightbox: pos.n, lightSet: 'lumi' }) })),
      ...(() => {
        const SET = st.lightSet === 'legacy' ? LEGACY : LUMI;
        const open = st.lightbox !== null && st.lightbox !== undefined && !!SET[st.lightbox];
        return {
          lightboxOpen: open,
          lightboxSrc: open ? SET[st.lightbox].src : '',
          lightboxAlt: open ? SET[st.lightbox].alt : '',
          lightboxCount: open ? (st.lightbox + 1) + ' of ' + SET.length : '',
          closeLightbox: () => this.setState({ lightbox: null }),
          prevPhoto: () => this.setState({ lightbox: (this.state.lightbox + SET.length - 1) % SET.length }),
          nextPhoto: () => this.setState({ lightbox: (this.state.lightbox + 1) % SET.length })
        };
      })(),
      legacyStrips: LEGACY.map((ph, n) => ({ ...ph, open: () => this.setState({ lightbox: n, lightSet: 'legacy' }) })),
      seriesLumi: (st.series || 'lumi') === 'lumi',
      seriesLegacy: st.series === 'legacy',
      seriesTabs: [{ id: 'lumi', name: 'Luminance' }, { id: 'legacy', name: 'Legacy Dance Team' }].map((sr) => {
        const on = (st.series || 'lumi') === sr.id;
        return { ...sr, selected: on ? 'true' : 'false', bg: on ? '#2b2b2b' : 'transparent', color: on ? '#fff' : '#2b2b2b', border: on ? '#2b2b2b' : '#c8c8c8', pick: () => this.setState({ series: sr.id, lightbox: null }) };
      }),
      gundaaImg: IMG_GUNDAA,
      exprPhotos: st.exprTab !== 'writing',
      exprWriting: st.exprTab === 'writing',
      exprTabs: [{ id: 'photos', name: 'Photographs' }, { id: 'writing', name: 'Writing' }].map((tb) => {
        const on = (st.exprTab || 'photos') === tb.id;
        return { ...tb, selected: on ? 'true' : 'false', line: on ? '#000' : 'transparent', color: on ? '#000' : '#5f5f5f', weight: on ? '600' : '400', pick: () => this.setState({ exprTab: tb.id }) };
      }),
      learningItems: ['Data visualization', 'Policy writing', 'Human behavior'].map((name, n) => ({ name, num: String(n + 1).padStart(2, '0') })),
      portraitCursor: st.aboutHi ? 'pointer' : 'default',
      revealPending: !ABOUT.every((ab) => (st.revealed || []).includes(ab.id)),
      revealCount: String(ABOUT.filter((ab) => (st.revealed || []).includes(ab.id)).length),
      showProjectPage: !!pageProject,
      tiles, labels, pairLabels, dots,
      layerCursor: st.hRegion ? 'pointer' : 'default',
      onMove, onLeave, onLayerClick,
      clearSel: () => this.setState({ locked: null }),
      panelAbout: !view,
      panelList: !!isRegion,
      panelProject: !!viewProject,
      isPreview,
      showBack: !!st.locked,
      listTitle: isRegion ? REGION_TITLES[view.id] : '',
      // The list title is highlighted in its field's color: a single field uses its label color,
      // an overlap uses the mix of its two, and the center uses near-black.
      listColor: !isRegion ? 'transparent' : view.id.length === 3 ? '#2b2b2b' : view.id.length === 1 ? LABEL_HEX[view.id] : css(mix(blend(view.id.split('').map((k) => hex(LABEL_HEX[k])), [0.5, 0.5]), [0, 0, 0], 0.12)),
      listCount: matched.length === 1 ? '1 project' : matched.length + ' projects',
      hasIntro: isRegion && view.id === 'BTP',
      listItems: matched.map((p) => ({ name: p.name, line: p.short, did: p.did, icon: pixPath(PIX[p.icon]), color: p.color || markerColor(p.sets), open: () => openProject(p.id), enter: () => this._projectSound() })),
      pName: viewProject ? viewProject.name : '',
      pTags: viewProject ? tagsFor(viewProject.sets) : [],
      pLine: viewProject ? viewProject.short : '',
      pDid: viewProject ? viewProject.did : '',
      pHasHero: !!(viewProject && viewProject.hero),
      pNoHero: !(viewProject && viewProject.hero),
      pHero: viewProject && viewProject.hero ? viewProject.hero : '',
      pHeroAlt: viewProject && viewProject.heroAlt ? viewProject.heroAlt : '',
      pHeroPos: viewProject && viewProject.heroPos ? viewProject.heroPos : '50% 50%',
      pageName: pageProject ? pageProject.name : '',
      pageTitle: pageProject ? pageProject.title : '',
      pageHasHero: !!(pageProject && pageProject.hero),
      pageNoHero: !(pageProject && pageProject.hero),
      pageHero: pageProject && pageProject.hero ? pageProject.hero : '',
      pageHeroAlt: pageProject && pageProject.heroAlt ? pageProject.heroAlt : '',
      pageHeroPos: pageProject && pageProject.heroPos ? pageProject.heroPos : '50% 50%',
      pageHasCredit: !!(pageProject && pageProject.heroCredit),
      pageHeroCredit: pageProject && pageProject.heroCredit ? pageProject.heroCredit : '',
      pageRole: pageProject ? pageProject.role : '',
      pageYear: pageProject ? pageProject.year : '',
      pagePlace: pageProject ? pageProject.place : '',
      pageTeam: pageProject ? pageProject.team : '',
      pageFacts: pageProject ? pageProject.facts : [],
      hasFacts: !!(pageProject && pageProject.facts.length),
      pageOverview: pageProject ? pageProject.sections.slice(0, 1) : [],
      pageSections: pageProject ? pageProject.sections.slice(1) : [],
      pageParts: (() => {
        if (!pageProject || !pageProject.parts) return [];
        const ks = pageProject.sets.split('');
        const rgbAccent = pageProject.color ? hex(pageProject.color) : ks.length === 3 ? hex('#2b2b2b') : ks.length === 1 ? hex(LABEL_HEX[ks[0]]) : mix(blend(ks.map((k) => hex(LABEL_HEX[k])), [0.5, 0.5]), [0, 0, 0], 0.12);
        const accent = css(rgbAccent);
        const tint = css(mix(rgbAccent, [255, 255, 255], 0.88));
        return pageProject.parts.map((pt) => ({
          ...pt,
          accent,
          steps: pt.steps.map((st2, n) => ({ ...st2, num: String(n + 1), accent, icon: stepIcon(st2.label), bg: n === pt.steps.length - 1 ? tint : '#fff', border: n === pt.steps.length - 1 ? tint : '#e6e6e6' }))
        }));
      })(),
      pageLinks: pageProject && pageProject.links ? pageProject.links : [],
      hasLinks: !!(pageProject && pageProject.links && pageProject.links.length),
      hasThinking: !!(pageProject && pageProject.thinking),
      thinkTitle: pageProject && pageProject.thinking ? pageProject.thinking.title : '',
      thinkIntro: pageProject && pageProject.thinking ? pageProject.thinking.intro : '',
      thinkSteps: (() => {
        if (!pageProject || !pageProject.thinking) return [];
        const ks = pageProject.sets.split('');
        const rgbAccent = pageProject.color ? hex(pageProject.color) : ks.length === 3 ? hex('#2b2b2b') : ks.length === 1 ? hex(LABEL_HEX[ks[0]]) : mix(blend(ks.map((k) => hex(LABEL_HEX[k])), [0.5, 0.5]), [0, 0, 0], 0.12);
        const accent = css(rgbAccent);
        const tint = css(mix(rgbAccent, [255, 255, 255], 0.88));
        const steps = pageProject.thinking.steps;
        return steps.map((st2, n) => ({ ...st2, num: String(n + 1), accent, icon: stepIcon(st2.label), bg: n === steps.length - 1 ? tint : '#fff', border: n === steps.length - 1 ? tint : '#e6e6e6' }));
      })(),
      pageTags: pageProject ? tagsFor(pageProject.sets) : [],
      pageLine: pageProject ? pageProject.line : '',
      nextName: nextProject ? nextProject.name : '',
      openNext: () => { if (nextProject) openProject(nextProject.id); },
      projNav: PROJECTS.map((p) => {
        const current = !!pageProject && pageProject.id === p.id;
        return {
          name: p.name, title: p.title,
          icon: pixPath(PIX[p.icon]), color: p.color || markerColor(p.sets),
          current: current ? 'page' : 'false',
          bg: current ? '#f2f2f2' : 'transparent',
          textColor: current ? '#000' : '#5f5f5f',
          weight: current ? '600' : '400',
          open: () => openProject(p.id)
        };
      })
    };
  }
}

const app = new Component();
const root = document.getElementById('app');
const view = (v) => html`<div @click=${v.onPageClick} style="min-height: 100vh; box-sizing: border-box; display: flex; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #000; font-size: 16px; line-height: 1.5">

<header style="display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: center; gap: 16px; padding: 20px 6vw">
<nav aria-label="Main" style="display: flex; align-items: center; gap: 28px">
${(v.navItems || []).map((n) => html`
<button type="button" @click=${n.go} style="min-height: 44px; padding: 0; background: transparent; border: none; cursor: pointer; font-size: 15px; color: ${n.color}; text-decoration: ${n.deco}; text-underline-offset: 6px">${n.name}</button>
`)}
<button type="button" aria-pressed="${v.soundPressed}" aria-label="${v.soundLabel}" @click=${v.toggleSound} style="min-height: 44px; min-width: 44px; padding: 0; background: transparent; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #5f5f5f">
<svg aria-hidden="true" viewBox="0 0 9 9" style="width: 18px; height: 18px; fill: currentColor; shape-rendering: crispEdges"><path d="${v.soundIcon}"></path></svg>
</button>
</nav>
</header>

${(v.showHome) ? html`
<div class="page-in" style="flex: 1; box-sizing: border-box; padding: 16px 6vw 48px; display: flex; flex-wrap: wrap; gap: 72px 160px; align-items: center; justify-content: center">

<div style="flex: 1 1 480px; max-width: 600px; min-width: 0; display: flex; flex-direction: column; gap: 14px">
<div data-keep="diagram" @mousemove=${v.onMove} @mouseleave=${v.onLeave} style="position: relative; width: 100%; aspect-ratio: 1 / 1; margin: 28px 0">

<svg aria-hidden="true" width="0" height="0" style="position: absolute"><defs>
<filter id="pencil" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="wob"></feTurbulence><feDisplacementMap in="SourceGraphic" in2="wob" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="shaky"></feDisplacementMap><feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="1" seed="11" result="grain"></feTurbulence><feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.6 0 0 0 -0.35" result="grainAlpha"></feColorMatrix><feComposite in="shaky" in2="grainAlpha" operator="in"></feComposite></filter>
<filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="5" stitchTiles="stitch"></feTurbulence><feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.45  0 0 0 0 0.45  0 0 0 0.9 -0.25"></feColorMatrix></filter>
</defs></svg>

<div aria-hidden="true" style="position: absolute; inset: 0; display: grid; grid-template-columns: repeat(21, minmax(0, 1fr)); pointer-events: none">
${(v.tiles || []).map((t) => html`
<div class="tile" style="background-color: ${t.color}; transition-delay: ${t.delay}ms"></div>
`)}
</div>

<svg aria-hidden="true" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; mix-blend-mode: soft-light; opacity: 0.7"><rect width="100%" height="100%" filter="url(#paper)"></rect></svg>

<button type="button" aria-label="Clear the selection" @click=${v.onLayerClick} style="position: absolute; inset: 0; width: 100%; height: 100%; background: transparent; border: none; padding: 0; cursor: ${v.layerCursor}"></button>

${(v.labels || []).map((l) => html`
<button type="button" data-label="field" aria-pressed="${l.pressed}" @mouseenter=${l.enter} @focus=${l.enter} @blur=${l.leave} @click=${l.pick} style="position: absolute; left: ${l.x}%; top: ${l.y}%; transform: ${l.tf}; min-height: 44px; padding: 0 8px; background: transparent; border: none; cursor: pointer; font-size: 16px; font-weight: 600; line-height: 1; color: ${l.color}; white-space: nowrap; display: flex; flex-direction: column; justify-content: center; align-items: ${l.align}; gap: 9px; scale: ${l.scale}; transition: color 200ms, scale 400ms cubic-bezier(.3,1.8,.5,1)"><span style="text-decoration: ${l.deco}; text-decoration-thickness: 1.5px; text-underline-offset: 3px">${(l.letters || []).map((ch) => html`<span style="color: ${ch.color}; transition: color .25s linear">${ch.c}</span>`)}</span><span style="font-size: 12px; font-weight: 400; font-style: italic; color: #8f8f8f; text-decoration: none">${l.question}</span></button>
`)}

${(v.pairLabels || []).map((pl) => html`
<p aria-hidden="${pl.hidden}" style="position: absolute; left: ${pl.x}%; top: ${pl.y}%; transform: translate(-50%, -50%); margin: 0; font-size: 16px; font-weight: 600; line-height: 1; color: ${pl.color}; white-space: nowrap; opacity: ${pl.opacity}; pointer-events: none; transition: opacity 300ms">${pl.name}</p>
`)}

${(v.dots || []).map((d) => html`
<button type="button" aria-label="Open ${d.name}" @mouseenter=${d.enter} @mouseleave=${d.leave} @focus=${d.enter} @blur=${d.leave} @click=${d.open} style="position: absolute; left: ${d.left}%; top: ${d.top}%; width: ${d.size}%; height: ${d.size}%; min-width: 28px; min-height: 28px; padding: 0; background: ${d.fill}; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; scale: ${d.scale}; transition: scale 300ms cubic-bezier(.3,1.8,.5,1), background-color .3s linear ${d.delay}ms">
<svg aria-hidden="true" viewBox="0 0 7 7" style="width: 70%; height: 70%; fill: ${d.iconColor}; shape-rendering: crispEdges; transition: fill 300ms"><path d="${d.icon}"></path></svg>
<span style="position: absolute; left: 50%; top: 100%; transform: translateX(-50%); margin-top: 4px; font-size: 12px; line-height: 1.2; padding: 1px 6px; background: #fff; color: ${d.textColor}; white-space: nowrap; pointer-events: none; transition: color 200ms">${d.name}</span>
</button>
`)}
</div>
</div>

<div style="order: -1; flex: 1 1 320px; max-width: 400px; min-width: 0; min-height: 560px; display: flex; flex-direction: column; justify-content: flex-start; gap: 24px">

${(v.panelAbout) ? html`
<div style="display: flex; flex-direction: column; gap: 28px">
<h1 style="margin: 0; font-size: 44px; font-weight: 500; line-height: 1.15; letter-spacing: -0.015em; max-width: 20ch">Anujin is a design researcher working toward responsible, lasting business models for climate and livelihoods.</h1>
</div>
` : nothing}

${(v.panelList) ? html`
<div style="display: flex; flex-direction: column; gap: 16px">
<div style="display: flex; flex-direction: column; gap: 4px">
<h2 style="margin: 0; font-size: 28px; font-weight: 500; line-height: 1.45"><span style="background: ${v.listColor}; color: #fff; padding: 2px 10px; box-decoration-break: clone; transition: background 300ms">${v.listTitle}</span></h2>
<p style="margin: 0; font-size: 13px; color: #6b6b6b">${v.listCount}</p>
</div>
${(v.hasIntro) ? html`
<p style="margin: 0; color: #333; max-width: 36ch">Where business, tech and people meet. [A sentence on how you design.]</p>
` : nothing}
<div style="display: flex; flex-direction: column">
${(v.listItems || []).map((it) => html`
<button type="button" @click=${it.open} @mouseenter=${it.enter} style="display: flex; align-items: flex-start; gap: 14px; text-align: left; padding: 16px 0; min-height: 44px; background: transparent; border: none; border-top: 1px solid #e3e3e3; cursor: pointer">
<span style="flex: none; width: 36px; height: 36px; margin-top: 2px; background: ${it.color}; display: flex; align-items: center; justify-content: center"><svg aria-hidden="true" viewBox="0 0 7 7" style="width: 64%; height: 64%; fill: #fff; shape-rendering: crispEdges"><path d="${it.icon}"></path></svg></span>
<span style="display: flex; flex-direction: column; gap: 2px; min-width: 0">
<span style="font-size: 17px">${it.name}</span>
<span style="font-size: 14px; color: #444">${it.line}</span>
<span style="font-size: 13px; color: #6b6b6b">${it.did}</span>
</span>
</button>
`)}
</div>
</div>
` : nothing}

${(v.panelProject) ? html`
<div style="display: flex; flex-direction: column; gap: 16px">
<div style="display: flex; flex-direction: column; gap: 6px">
<h2 style="margin: 0; font-size: 28px; font-weight: 500; line-height: 1.45">${v.pName}</h2>
<div style="display: flex; flex-wrap: wrap; gap: 14px">
${(v.pTags || []).map((t) => html`
<span style="display: flex; align-items: center; gap: 6px; font-size: 13px; color: #555"><span style="width: 8px; height: 8px; border-radius: 50%; background: ${t.color}"></span>${t.name}</span>
`)}
</div>
</div>
${(v.pHasHero) ? html`
<img src="${v.pHero}" alt="${v.pHeroAlt}" style="display: block; width: 100%; max-width: 330px; aspect-ratio: 16 / 10; object-fit: cover; object-position: ${v.pHeroPos}">
` : nothing}
${(v.pNoHero) ? html`
<div style="width: 100%; max-width: 330px; aspect-ratio: 16 / 10; background: #f2f2f2; display: flex; align-items: center; justify-content: center; color: #5f5f5f; font-size: 13px">[Project image]</div>
` : nothing}
<p style="margin: 0; color: #333; max-width: 36ch">${v.pLine}</p>
<p style="margin: 0; font-size: 14px; color: #6b6b6b; max-width: 40ch">${v.pDid}</p>
</div>
` : nothing}

${(v.isPreview) ? html`
` : nothing}

${(v.showBack) ? html`
<button type="button" aria-label="Back" @click=${v.clearSel} style="align-self: flex-start; width: 44px; height: 44px; margin-left: -10px; padding: 0; background: transparent; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #2b2b2b"><svg aria-hidden="true" viewBox="0 0 24 24" style="width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 1.6px; stroke-linecap: round; stroke-linejoin: round"><path d="M19 12H5M11 6l-6 6 6 6"></path></svg></button>
` : nothing}

</div>
</div>
` : nothing}

${(v.showAboutPage) ? html`
<svg aria-hidden="true" width="0" height="0" style="position: absolute"><defs><filter id="paper2" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="5" stitchTiles="stitch"></feTurbulence><feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.45  0 0 0 0 0.45  0 0 0 0.9 -0.25"></feColorMatrix></filter></defs></svg>
<main class="page-in" style="flex: 1; width: 100%; box-sizing: border-box; padding: 16px 6vw 96px; display: flex; flex-direction: column; gap: 24px">
<h1 style="margin: 0; text-align: center; font-size: 44px; font-weight: 500; line-height: 1.1">About me</h1>
<p style="margin: 0 auto 8px; max-width: 62ch; text-align: center; font-size: 18px; line-height: 1.6; color: #333">I’m Anujin Naranbaatar, an engineer who studies Design at the Stanford d.school, in the Human and Stakeholder Research track with a focus on the Planet domain.</p>

<div class="about-stage">
${(v.aboutLines || []).map((ln) => html`
<svg class="about-line" aria-hidden="true" viewBox="0 0 1000 520" preserveAspectRatio="xMidYMid meet"><polyline points="${ln.pts}" style="fill: none; stroke: ${ln.color}; stroke-width: 1.2px; stroke-dasharray: ${ln.dash}; vector-effect: non-scaling-stroke; transition: stroke 300ms"></polyline><circle cx="${ln.fx}" cy="${ln.fy}" r="4" style="fill: ${ln.color}; transition: fill 300ms"></circle></svg>
`)}

<div class="about-portrait" data-keep="portrait" @mousemove=${v.onPortraitMove} @mouseleave=${v.onPortraitLeave}>
<div aria-hidden="true" style="position: absolute; inset: 0; display: grid; grid-template-columns: repeat(28, minmax(0, 1fr)); grid-template-rows: repeat(36, minmax(0, 1fr)); pointer-events: none">
${(v.portrait || []).map((px) => html`
<div class="tile" style="background-color: ${px.c}; transition-delay: ${px.d}ms"></div>
`)}
</div>
<svg aria-hidden="true" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; mix-blend-mode: soft-light; opacity: 0.6"><rect width="100%" height="100%" filter="url(#paper2)"></rect></svg>
<button type="button" aria-label="Pick the feature under the pointer" @click=${v.onPortraitClick} style="position: absolute; inset: 0; width: 100%; height: 100%; background: transparent; border: none; padding: 0; cursor: ${v.portraitCursor}"></button>
</div>

${(v.aboutRows || []).map((ar) => html`
<div class="about-card" @mouseenter=${ar.enter} @mouseleave=${ar.leave} style="top: ${ar.top}%; left: ${ar.left}; right: ${ar.right}; text-align: ${ar.align}">
<button type="button" class="ab-head" aria-expanded="${ar.expanded}" @focus=${ar.enter} @blur=${ar.leave} @click=${ar.pick} style="width: 100%; display: flex; flex-direction: ${ar.dir}; justify-content: flex-start; align-items: center; gap: 10px; min-height: 40px; padding: 4px 0; background: transparent; border: none; cursor: pointer; text-align: inherit">
<span style="flex: none; width: 12px; height: 12px; background: ${ar.color}"></span>
<span style="flex: none; font-size: 13px; color: #6b6b6b">${ar.part}</span>
<span style="font-size: 17px; font-weight: ${ar.weight}">${ar.title}</span>
</button>
${(ar.open) ? html`
<div style="display: flex; flex-direction: column; gap: 6px; font-size: 14px; line-height: 1.5; color: #333">
<p style="margin: 0">${ar.body}</p>
${(ar.hasList) ? html`
<p style="margin: 0; color: #555">${ar.listText}</p>
` : nothing}
</div>
` : nothing}
</div>
`)}
</div>


<svg aria-hidden="true" width="0" height="0" style="position: absolute"><defs><filter id="pencil2" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="wob"></feTurbulence><feDisplacementMap in="SourceGraphic" in2="wob" scale="1.6" xChannelSelector="R" yChannelSelector="G" result="shaky"></feDisplacementMap><feTurbulence type="fractalNoise" baseFrequency="2.6" numOctaves="1" seed="11" result="grain"></feTurbulence><feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.6 0 0 0 -0.35" result="grainAlpha"></feColorMatrix><feComposite in="shaky" in2="grainAlpha" operator="in"></feComposite></filter></defs></svg>

${(v.belowInsights) ? html`
<section style="width: 100%; max-width: 1200px; margin: 72px auto 0; padding-top: 56px; border-top: 1px solid #e3e3e3; display: flex; flex-direction: column; gap: 32px">
<div style="display: flex; flex-direction: column; gap: 8px; max-width: 60ch">
<span style="font-size: 13px; color: #6b6b6b">What I love</span>
<h2 style="margin: 0; font-size: 32px; font-weight: 500; line-height: 1.2">Ideas I keep coming back to</h2>
</div>

<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 20px">
${(v.insights || []).map((fc) => html`
${(fc.isCard) ? html`
<button type="button" class="mag-cursor" aria-pressed="${fc.pressed}" aria-label="${fc.title}, flip card" @click=${fc.flip} style="height: 260px; padding: 0; border: none; background: transparent; perspective: 1200px; text-align: left; font: inherit; color: inherit">
<div class="flip" style="transform: ${fc.turn}">
<div class="face">
<div class="pxframe"></div>
<div class="pxinner" style="display: flex; flex-direction: column; gap: 8px; padding: 16px 18px">
<svg aria-hidden="true" viewBox="0 0 120 80" style="width: 84px; height: 56px; overflow: visible; margin-bottom: 4px"><path d="${fc.fillD}" style="fill: ${fc.soft}; stroke: #2b2b2b; stroke-width: 2px; stroke-linejoin: round"></path><path d="${fc.lineD}" style="fill: none; stroke: #2b2b2b; stroke-width: 2px; stroke-linecap: round; stroke-linejoin: round"></path></svg>
<span style="font-size: 12px; color: #6b6b6b">${fc.num}</span>
<span style="font-size: 17px; font-weight: 600; line-height: 1.2">${fc.title}</span>
<span style="font-size: 14px; line-height: 1.45; color: #333">${fc.desc}</span>
<span style="margin-top: auto; font-size: 12px; color: #6b6b6b">Flip for a real example</span>
</div>
</div>
<div class="face face-back">
<div class="pxframe"></div>
<div class="pxinner" style="display: flex; flex-direction: column; gap: 8px; padding: 16px 18px">
<span style="font-size: 12px; color: #6b6b6b">Real-world example</span>
<span style="font-size: 17px; font-weight: 600; line-height: 1.2">${fc.title}</span>
<span style="font-size: 14px; line-height: 1.5; color: #222">${fc.example}</span>
</div>
</div>
</div>
</button>
` : nothing}
${(fc.isQuote) ? html`
<figure class="heart-cursor" style="position: relative; height: 260px; margin: 0">
<div class="pxframe"></div>
<div class="pxinner" style="display: flex; flex-direction: column; justify-content: center; gap: 12px; padding: 18px 20px">
<blockquote style="margin: 0; font-family: 'Reenie Beanie', 'Bradley Hand', 'Segoe Print', cursive; font-size: 26px; line-height: 1.05; color: #2b2b2b; filter: url(#pencil2)">“${fc.text}”</blockquote>
<figcaption style="font-size: 14px; color: #555">${fc.who}</figcaption>
</div>
</figure>
` : nothing}
`)}
</div>
</section>
` : nothing}

${(v.belowPhotos) ? html`
<section style="width: 100%; max-width: 1200px; margin: 72px auto 0; padding-top: 56px; border-top: 1px solid #e3e3e3; display: flex; flex-direction: column; gap: 28px">
<div style="display: flex; flex-direction: column; gap: 8px; max-width: 60ch">
<span style="font-size: 13px; color: #6b6b6b">Expression</span>
<h2 style="margin: 0; font-size: 32px; font-weight: 500; line-height: 1.2">Through my lens</h2>
</div>
<div role="tablist" aria-label="Expression" style="display: flex; gap: 28px; border-bottom: 1px solid #e3e3e3">
${(v.exprTabs || []).map((tb) => html`
<button type="button" role="tab" aria-selected="${tb.selected}" @click=${tb.pick} style="min-height: 44px; padding: 0 0 10px; margin-bottom: -1px; background: transparent; border: none; border-bottom: 2px solid ${tb.line}; cursor: pointer; font-size: 16px; color: ${tb.color}; font-weight: ${tb.weight}">${tb.name}</button>
`)}
</div>

${(v.exprPhotos) ? html`
<div role="group" aria-label="Photo series" style="display: flex; flex-wrap: wrap; gap: 8px">
${(v.seriesTabs || []).map((sr) => html`
<button type="button" aria-pressed="${sr.selected}" @click=${sr.pick} style="min-height: 40px; padding: 0 16px; border: 1px solid ${sr.border}; background: ${sr.bg}; color: ${sr.color}; cursor: pointer; font-size: 14px">${sr.name}</button>
`)}
</div>

${(v.seriesLumi) ? html`
<div style="display: flex; flex-wrap: wrap; gap: 24px 80px">
<div style="flex: 1 1 240px; display: flex; flex-direction: column; gap: 6px">
<span style="font-size: 13px; color: #6b6b6b">Photo series</span>
<h3 style="margin: 0; font-size: 26px; font-weight: 500">Luminance</h3>
</div>
<div style="flex: 999 1 520px; min-width: 0; display: flex; flex-direction: column; gap: 14px; font-size: 17px; line-height: 1.6; color: #333; max-width: 64ch">
<p style="margin: 0">In our day-to-day lives, we come across countless small things that catch our attention: a buzzing phone, towering buildings, beautiful sunshine, or a snake around your neck. What always resonates with me are the quiet moments where light hits a surface, creating a warm feeling and geometric lines that subtly organize the visual chaos around us.</p>
<p style="margin: 0">It’s these unassuming moments, like the soft glow of light or the clean lines of a structure, that add a touch of magic to the ordinary. They might seem small, but they carry a warmth and charm that is easy to overlook in the hustle of daily life.</p>
</div>
</div>
<div style="display: flex; flex-wrap: wrap; align-items: flex-start">
${(v.lumiMessy || []).map((lp) => html`
<button type="button" class="mx cam-cursor" aria-label="Open photo: ${lp.alt}" @click=${lp.open} style="position: relative; z-index: ${lp.z}; display: block; width: ${lp.w}%; margin: ${lp.mt}px 0 0 ${lp.ml}%; padding: 0; border: none; background: transparent">
<img src="${lp.src}" alt="${lp.alt}" loading="lazy" style="display: block; width: 100%; height: auto; box-shadow: 0 0 0 6px #fff">
</button>
`)}
</div>
` : nothing}

${(v.seriesLegacy) ? html`
<div style="display: flex; flex-wrap: wrap; gap: 24px 80px">
<div style="flex: 1 1 240px; display: flex; flex-direction: column; gap: 6px">
<span style="font-size: 13px; color: #6b6b6b">Photo series</span>
<h3 style="margin: 0; font-size: 26px; font-weight: 500">Legacy Dance Team</h3>
<span style="font-size: 14px; color: #555">Stanford University, May 2024</span>
</div>
</div>
<div style="display: flex; flex-direction: column; gap: 28px">
${(v.legacyStrips || []).map((lp) => html`
<button type="button" class="cam-cursor" aria-label="Open photo: ${lp.alt}" @click=${lp.open} style="display: block; width: 100%; padding: 0; border: none; background: transparent">
<img src="${lp.src}" alt="${lp.alt}" loading="lazy" style="display: block; width: 100%; height: auto">
</button>
`)}
</div>
` : nothing}

${(v.lightboxOpen) ? html`
<div role="dialog" aria-modal="true" aria-label="Luminance photo" style="position: fixed; inset: 0; z-index: 60; display: flex; align-items: center; justify-content: center; padding: 56px 24px">
<button type="button" aria-label="Close photo" @click=${v.closeLightbox} style="position: absolute; inset: 0; width: 100%; height: 100%; border: none; padding: 0; background: rgba(12,12,12,0.94); cursor: zoom-out"></button>
<div style="position: relative; display: block; pointer-events: none">
<img src="${v.lightboxSrc}" alt="${v.lightboxAlt}" style="display: block; max-width: calc(100vw - 48px); max-height: calc(100vh - 160px); object-fit: contain">
</div>
<div style="position: absolute; left: 24px; right: 24px; bottom: 14px; display: flex; justify-content: space-between; align-items: center; gap: 16px; color: #fff; font-size: 14px">
<button type="button" @click=${v.prevPhoto} style="min-height: 44px; padding: 0 12px; background: transparent; border: 1px solid rgba(255,255,255,0.5); color: #fff; cursor: pointer">Previous</button>
<span>${v.lightboxCount}</span>
<button type="button" @click=${v.nextPhoto} style="min-height: 44px; padding: 0 12px; background: transparent; border: 1px solid rgba(255,255,255,0.5); color: #fff; cursor: pointer">Next</button>
</div>
<button type="button" @click=${v.closeLightbox} style="position: absolute; top: 12px; right: 16px; min-height: 44px; padding: 0 12px; background: transparent; border: 1px solid rgba(255,255,255,0.5); color: #fff; cursor: pointer; font-size: 14px">Close</button>
</div>
` : nothing}
` : nothing}

${(v.exprWriting) ? html`
<a class="pen-cursor" href="https://ureca.com/news/mongolian-herders-natures-stewards-on-the-frontline-of-climate-change" target="_blank" rel="noopener" style="display: flex; flex-wrap: wrap; gap: 32px 56px; align-items: flex-start; max-width: 1100px; color: #000; text-decoration: none">
<figure style="flex: 1 1 280px; max-width: 440px; margin: 8px 0 0; display: flex; flex-direction: column; gap: 8px; rotate: -1.5deg">
<img src="${v.gundaaImg}" alt="Gundaa, a herder, speaking with his hand at his chin inside his home" style="display: block; width: 100%; height: auto">
<figcaption style="font-size: 12px; color: #6b6b6b">Photo: URECA</figcaption>
</figure>
<div style="flex: 999 1 360px; min-width: 0; display: flex; flex-direction: column; padding-bottom: 8px; line-height: 40px; background-image: repeating-linear-gradient(to bottom, transparent 0, transparent 39px, #E6E2D9 39px, #E6E2D9 40px)">
<span style="font-size: 13px; line-height: 40px; color: #6b6b6b">Interview, URECA, May 2026</span>
<span style="font-family: 'Reenie Beanie', 'Bradley Hand', 'Segoe Print', cursive; font-size: 36px; line-height: 40px; color: #2b2b2b; filter: url(#pencil2)">Mongolian Herders: Nature’s Stewards on the Frontline of Climate Change</span>
<span style="font-family: 'Reenie Beanie', 'Bradley Hand', 'Segoe Print', cursive; font-size: 28px; line-height: 40px; color: #444; filter: url(#pencil2)">The story of Gundaa, a herder in Bayankhongor Province, and three decades of adapting to a changing steppe.</span>
<span style="font-family: 'Reenie Beanie', 'Bradley Hand', 'Segoe Print', cursive; font-size: 26px; line-height: 40px; color: #2b2b2b; text-decoration: underline; text-underline-offset: 5px; text-decoration-thickness: 1px; filter: url(#pencil2)">Read the full story</span>
</div>
</a>
` : nothing}
</section>
` : nothing}

${(v.belowLearning) ? html`
<section style="width: 100%; max-width: 1200px; margin: 72px auto 0; padding-top: 56px; border-top: 1px solid #e3e3e3; display: flex; flex-direction: column; gap: 32px">
<div style="display: flex; flex-direction: column; gap: 8px; max-width: 60ch">
<span style="font-size: 13px; color: #6b6b6b">Learning</span>
<h2 style="margin: 0; font-size: 32px; font-weight: 500; line-height: 1.2">What I’m studying at Stanford</h2>
</div>
<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px">
${(v.learningItems || []).map((lr) => html`
<div style="position: relative; height: 150px">
<div class="pxframe"></div>
<div class="pxinner" style="display: flex; flex-direction: column; justify-content: flex-end; gap: 6px; padding: 18px 20px">
<span style="font-size: 12px; color: #6b6b6b">${lr.num}</span>
<span style="font-size: 20px; font-weight: 600; line-height: 1.2">${lr.name}</span>
</div>
</div>
`)}
</div>
</section>
` : nothing}

<section aria-labelledby="contact-title" style="width: 100%; max-width: 1200px; margin: 72px auto 0; padding-top: 56px; border-top: 1px solid #e3e3e3; display: flex; flex-wrap: wrap; gap: 24px 80px; align-items: flex-start">
<div style="flex: 1 1 280px; display: flex; flex-direction: column; gap: 8px">
<span style="font-size: 13px; color: #6b6b6b">Contact</span>
<h2 id="contact-title" style="margin: 0; font-size: 32px; font-weight: 500; line-height: 1.2">Let’s talk</h2>
</div>
<div style="flex: 999 1 480px; min-width: 0; display: flex; flex-direction: column; gap: 20px">
<p style="margin: 0; font-size: 17px; line-height: 1.6; color: #333; max-width: 52ch">I’m always happy to talk about business design, climate and livelihoods, or a project you’re working on.</p>
<div style="display: flex; flex-wrap: wrap; gap: 12px">
${(v.contactLinks || []).map((ct) => html`
${(ct.linked) ? html`
<a href="${ct.href}" target="_blank" rel="noopener" style="position: relative; display: block; min-width: 220px; height: 64px; color: #000; text-decoration: none">
<div class="pxframe"></div>
<div class="pxinner" style="display: flex; flex-direction: column; justify-content: center; gap: 2px; padding: 0 18px">
<span style="font-size: 12px; color: #6b6b6b">${ct.label}</span>
<span style="font-size: 16px; text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px">${ct.value}</span>
</div>
</a>
` : nothing}
${(ct.plain) ? html`
<div style="position: relative; min-width: 220px; height: 64px">
<div class="pxframe"></div>
<div class="pxinner" style="display: flex; flex-direction: column; justify-content: center; gap: 2px; padding: 0 18px">
<span style="font-size: 12px; color: #6b6b6b">${ct.label}</span>
<span style="font-size: 16px">${ct.value}</span>
</div>
</div>
` : nothing}
`)}
</div>
</div>
</section>
</main>
` : nothing}

${(v.showProjectPage) ? html`
<main class="page-in" style="flex: 1; width: 100%; box-sizing: border-box; padding: 16px 6vw 96px; display: flex; flex-direction: column; gap: 40px">
<button type="button" @click=${v.goBack} style="align-self: flex-start; min-height: 44px; padding: 0; background: transparent; border: none; border-bottom: 1px solid #000; cursor: pointer; font-size: 14px">Back</button>

<div style="display: flex; flex-wrap: wrap; gap: 40px 64px; align-items: flex-start">
<nav aria-label="Projects" style="flex: 1 1 200px; max-width: 240px; box-sizing: border-box; padding-right: 24px; border-right: 1px solid #e3e3e3; display: flex; flex-direction: column; gap: 4px">
<span style="font-size: 13px; color: #6b6b6b; margin-bottom: 8px">Projects</span>
${(v.projNav || []).map((pn) => html`
<button type="button" aria-current="${pn.current}" @click=${pn.open} style="display: flex; align-items: center; gap: 12px; text-align: left; min-height: 40px; padding: 6px 0; background: transparent; border: none; cursor: pointer; color: ${pn.textColor}; transition: color 200ms">
<span style="font-size: 15px; font-weight: ${pn.weight}">${pn.name}</span>
</button>
`)}
</nav>
<div style="flex: 999 1 560px; min-width: 0; display: flex; flex-direction: column; gap: 56px">
<div style="display: flex; flex-wrap: wrap; gap: 40px 80px; align-items: flex-end">
<div style="flex: 999 1 520px; min-width: 0; display: flex; flex-direction: column; gap: 20px">
<div style="display: flex; flex-wrap: wrap; gap: 16px">
${(v.pageTags || []).map((t) => html`
<span style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #444"><span style="width: 10px; height: 10px; background: ${t.color}"></span>${t.name}</span>
`)}
</div>
<p style="margin: 0; font-size: 16px; color: #555">${v.pageName}</p>
<h1 style="margin: 0; font-size: clamp(34px, 3.4vw, 54px); font-weight: 500; line-height: 1.1; letter-spacing: -0.015em; max-width: 26ch">${v.pageTitle}</h1>
</div>
<div style="flex: 0 1 240px; min-width: 0; display: flex; flex-direction: column; gap: 4px; font-size: 16px">
<div style="display: flex; flex-direction: column; gap: 4px"><span style="font-size: 13px; color: #6b6b6b">Role</span><span>${v.pageRole}</span></div>
</div>
</div>

${(v.pageHasHero) ? html`
<figure style="margin: 0; display: flex; flex-direction: column; gap: 8px">
<img src="${v.pageHero}" alt="${v.pageHeroAlt}" style="display: block; width: 100%; aspect-ratio: 21 / 9; object-fit: cover; object-position: ${v.pageHeroPos}">
${(v.pageHasCredit) ? html`
<figcaption style="font-size: 12px; color: #6b6b6b; text-align: right">${v.pageHeroCredit}</figcaption>
` : nothing}
</figure>
` : nothing}
${(v.pageNoHero) ? html`
<div style="width: 100%; aspect-ratio: 21 / 9; display: flex; align-items: center; justify-content: center; background: #f2f2f2; color: #5f5f5f; font-size: 13px">[Project hero image]</div>
` : nothing}

${(v.pageOverview || []).map((sec) => html`
<div style="display: flex; flex-wrap: wrap; gap: 16px 80px">
<h2 style="flex: 1 1 220px; margin: 0; font-size: 22px; font-weight: 500">${sec.h}</h2>
<div style="flex: 999 1 560px; min-width: 0; display: flex; flex-direction: column; gap: 20px; font-size: 19px; line-height: 1.6; color: #333; max-width: 68ch">
${(sec.ps || []).map((para) => html`
<p style="margin: 0">${para}</p>
`)}
</div>
</div>
`)}

${(v.hasThinking) ? html`
<div style="display: flex; flex-direction: column; gap: 28px">
<div style="display: flex; flex-wrap: wrap; gap: 16px 80px">
<h2 style="flex: 1 1 220px; margin: 0; font-size: 22px; font-weight: 500">${v.thinkTitle}</h2>
<p style="flex: 999 1 560px; min-width: 0; margin: 0; font-size: 19px; line-height: 1.6; color: #333; max-width: 68ch">${v.thinkIntro}</p>
</div>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px">
${(v.thinkSteps || []).map((stp) => html`
<div style="display: flex; flex-direction: column; gap: 12px; padding: 20px; min-height: 180px; box-sizing: border-box; background: ${stp.bg}; border: 1px solid ${stp.border}">
<span style="width: 40px; height: 40px; background: ${stp.accent}; display: flex; align-items: center; justify-content: center"><svg aria-hidden="true" viewBox="0 0 7 7" style="width: 62%; height: 62%; fill: #fff; shape-rendering: crispEdges"><path d="${stp.icon}"></path></svg></span>
<span style="font-size: 13px; color: #6b6b6b">${stp.num}. ${stp.label}</span>
<span style="font-size: 17px; font-weight: 500; line-height: 1.3">${stp.t}</span>
<span style="font-size: 14px; line-height: 1.5; color: #444">${stp.d}</span>
</div>
`)}
</div>
</div>
` : nothing}

${(v.pageSections || []).map((sec) => html`
<div style="display: flex; flex-wrap: wrap; gap: 16px 80px">
<h2 style="flex: 1 1 220px; margin: 0; font-size: 22px; font-weight: 500">${sec.h}</h2>
<div style="flex: 999 1 560px; min-width: 0; display: flex; flex-direction: column; gap: 20px; font-size: 19px; line-height: 1.6; color: #333; max-width: 68ch">
${(sec.ps || []).map((para) => html`
<p style="margin: 0">${para}</p>
`)}
</div>
</div>
`)}

${(v.pageParts || []).map((pt) => html`
<div style="display: flex; flex-direction: column; gap: 24px; padding-top: 40px; border-top: 1px solid #e3e3e3">
<div style="display: flex; flex-wrap: wrap; gap: 16px 80px">
<div style="flex: 1 1 220px; min-width: 0; display: flex; flex-direction: column; gap: 6px">
<span style="font-size: 13px; color: #6b6b6b">${pt.label}</span>
<h2 style="margin: 0; font-size: 24px; font-weight: 500; line-height: 1.25">${pt.h}</h2>
<div style="display: flex; flex-direction: column; align-items: flex-start; gap: 6px; margin-top: 10px">
<span style="font-size: 13px; color: #6b6b6b">Responsibility</span>
<span style="background: ${pt.accent}; color: #fff; font-size: 15px; line-height: 1.45; padding: 3px 10px; box-decoration-break: clone">${pt.role}</span>
</div>
</div>
<p style="flex: 999 1 560px; min-width: 0; margin: 0; font-size: 19px; line-height: 1.6; color: #333; max-width: 68ch">${pt.p}</p>
</div>
<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px">
${(pt.steps || []).map((stp) => html`
<div style="display: flex; flex-direction: column; gap: 12px; padding: 20px; min-height: 180px; box-sizing: border-box; background: ${stp.bg}; border: 1px solid ${stp.border}">
<span style="width: 40px; height: 40px; background: ${stp.accent}; display: flex; align-items: center; justify-content: center"><svg aria-hidden="true" viewBox="0 0 7 7" style="width: 62%; height: 62%; fill: #fff; shape-rendering: crispEdges"><path d="${stp.icon}"></path></svg></span>
<span style="font-size: 13px; color: #6b6b6b">${stp.num}. ${stp.label}</span>
<span style="font-size: 17px; font-weight: 500; line-height: 1.3">${stp.t}</span>
<span style="font-size: 14px; line-height: 1.5; color: #444">${stp.d}</span>
</div>
`)}
</div>
</div>
`)}

${(v.hasLinks) ? html`
<div style="display: flex; flex-wrap: wrap; gap: 16px 80px">
<h2 style="flex: 1 1 220px; margin: 0; font-size: 22px; font-weight: 500">Read more</h2>
<div style="flex: 999 1 560px; min-width: 0; display: flex; flex-direction: column; gap: 12px; max-width: 68ch">
${(v.pageLinks || []).map((lk) => html`
<a href="${lk.url}" target="_blank" rel="noopener" style="display: flex; flex-direction: column; gap: 6px; padding: 20px 24px; background: #f6f6f6; color: #000; text-decoration: none">
<span style="font-size: 13px; color: #6b6b6b">${lk.source}, ${lk.date}</span>
<span style="font-size: 20px; font-weight: 500; line-height: 1.3; text-decoration: underline; text-underline-offset: 4px; text-decoration-thickness: 1px">${lk.title}</span>
<span style="font-size: 15px; line-height: 1.5; color: #444">${lk.desc}</span>
</a>
`)}
</div>
</div>
` : nothing}
</div>
</div>
</main>
` : nothing}

</div>`;

let queued = false;
function draw() { queued = false; render(view(app.renderVals()), root); }
function schedule() { if (!queued) { queued = true; requestAnimationFrame(draw); } }
draw();
if (app.componentDidMount) app.componentDidMount();
