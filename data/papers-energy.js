/* ============================================================
   BenchtopBuild — papers-energy.js
   Threads for the Energy Systems section.
   (Thread template: see top of papers-ops.js)
   ============================================================ */

/* ------------------------------------------------------------
   EN-02 · Fusion Energy
   ------------------------------------------------------------ */

PAPERS.push({
  id: "gp-2026-0009",
  board: "fusion",
  kind: "SURVEY",
  pinned: false,
  rev: "C",
  title: "The Commercial Fusion Landscape, Mid-2026: Approaches, Companies, and the Engineering Gaps That Decide It",
  posted: "2026-02-22",
  updated: "2026-06-02",
  tags: ["fusion-industry", "tokamak", "FRC", "z-pinch", "stellarator", "pulsed-power"],
  abstract: "Private fusion has moved from a punchline to an industry with several billion dollars of committed capital and at least four credible attempts at net-energy-relevant machines this decade. This survey maps the field by confinement approach rather than by press release: magnetic confinement (tokamaks, spherical tokamaks, stellarators), pulsed magneto-inertial schemes (field-reversed configuration merging, sheared-flow Z-pinch, magnetized target), and inertial approaches. For each major company I record the machine lineage, the publicly stated near-term goal, and — the part I care about as an engineer — which unsolved engineering problem their concept lives or dies by. Claims below are compiled from public statements and are dated; corrections and news land in the discussion section.",
  sections: [
    {
      h: "How to read fusion claims",
      body: [
        "Three different 'breakeven' claims circulate, and conflating them is the most common error in fusion coverage. <b>Q<sub>plasma</sub></b> compares fusion power out of the plasma to heating power into it; the National Ignition Facility exceeded this (target gain ≈ 1.5, later above 2) in December 2022 — a physics milestone on a machine never meant to be a power plant [1]. <b>Q<sub>engineering</sub></b> compares electrical power out of the whole facility to electrical power in; nobody has ever exceeded it, and lasers/magnets/cryogenics make it brutally harder. <b>Commercial breakeven</b> adds capacity factor and cost. When a company says 'net energy,' the first question is always: which Q?",
        "The honest scorecard for any concept is the Lawson framing — what triple product (density × temperature × confinement time) has the approach actually demonstrated, and how far is the gap to its claimed operating point [2]. Wurzel and Hsu's compilation remains the best single reference for placing every concept on one chart [2]."
      ]
    },
    {
      h: "Taxonomy",
      body: [
        { list: [
          "<b>Magnetic confinement (steady or long-pulse):</b> tokamaks (high-field compact: CFS; conventional scale: ITER), spherical tokamaks (Tokamak Energy), stellarators (Proxima Fusion, Type One Energy). The plasma is held continuously by magnetic fields; the EE problems are magnets, heating systems (gyrotrons, neutral beams), and steady-state exhaust.",
          "<b>Pulsed / magneto-inertial:</b> compress a magnetized plasma transiently — FRC merging-compression (Helion), sheared-flow-stabilized Z-pinch (Zap Energy), liquid-metal mechanical compression (General Fusion), magnetically driven implosion (Pacific Fusion). The EE problems are repetitive pulsed power: switching megajoules in microseconds, at hertz, for years.",
          "<b>Inertial:</b> laser indirect drive (NIF — government science facility), projectile impact (First Light, since pivoted toward licensing its amplifier technology). The EE problems are driver efficiency and rep rate."
        ]}
      ]
    },
    {
      h: "The companies",
      body: [
        "Compiled from public statements; 'goal' rows are the companies' stated targets, not my predictions. Dates in parentheses are when I last checked the claim.",
        { table: {
          caption: "TABLE I — Major private fusion efforts, as compiled mid-2026",
          head: ["Company", "Approach", "Machine lineage", "Stated near-term goal", "The engineering it lives or dies by"],
          rows: [
            ["Commonwealth Fusion Systems (US)", "Compact high-field tokamak (REBCO HTS)", "TFMC 20 T demo (2021) → SPARC (assembly/commissioning; first plasma targeted mid-decade) → ARC (Virginia site announced for early 2030s grid power)", "SPARC Q>1 deuterium-tritium operation (2026)", "HTS magnet quench protection; divertor heat exhaust"],
            ["Helion Energy (US)", "Pulsed FRC merging-compression, direct induction energy recovery", "Trenta → Polaris (operational; 7th machine)", "Demonstrate electricity from fusion; PPA with Microsoft targeting ~2028 delivery", "Rep-rated pulsed power at MJ scale; switch lifetime; He-3 fuel cycle bootstrapping"],
            ["TAE Technologies (US)", "Beam-driven FRC, aiming ultimately at p-B11", "Norman → Copernicus (under construction)", "Hydrogen-equivalent net-energy-relevant conditions on Copernicus", "Neutral beam efficiency; sustaining FRC stability at reactor parameters"],
            ["Zap Energy (US)", "Sheared-flow-stabilized Z-pinch (no external magnets)", "FuZE → FuZE-Q; Century pulsed-power platform", "Scientific breakeven-relevant scaling on FuZE-Q", "Electrode erosion; repetitive pulsed power; whether sheared-flow stability holds at higher current"],
            ["Tokamak Energy (UK)", "Spherical tokamak + HTS magnets", "ST40 (100M °C ions, 2022) → ST80-HTS planned → ST-E1 pilot concept", "ST80-HTS as integrated HTS spherical tokamak demo", "HTS central column in a neutron environment; spherical-tokamak exhaust"],
            ["General Fusion (Canada)", "Magnetized target fusion, liquid-lithium piston compression", "PI3 → LM26 (restructured program, 2025)", "Compression results relevant to breakeven conditions on LM26", "Repeatable symmetric mechanical compression; funding continuity"],
            ["Proxima Fusion (Germany)", "Quasi-isodynamic stellarator (Wendelstein 7-X lineage)", "Stellaris design study (2025) → Alpha demo planned", "Engineering design of Stellaris; HTS stellarator coils", "Coil manufacturing tolerances; remote maintenance of 3-D geometry"],
            ["Type One Energy (US)", "Stellarator", "Infinity One design; siting work with TVA announced", "Fusion pilot plant design certification path", "Same stellarator manufacturing problem, different optimization"],
            ["Pacific Fusion (US)", "Pulsed magnetic inertial fusion", "Demonstration system in design (large Series A, 2024)", "Staged demonstration of driver modules", "Driver cost/efficiency; rep-rate path beyond single shots"],
            ["— ITER (intergov.)", "Conventional-scale tokamak", "Assembly; rebaselined schedule (2024) pushes full research phase to mid-2030s", "First plasma per revised baseline", "Schedule itself; Nb3Sn magnet repairs already absorbed"],
            ["— NIF (US gov.)", "Laser inertial, indirect drive", "Ignition demonstrated Dec 2022, repeated since", "Science facility, not a power path", "Driver efficiency ~1%; not designed for energy"]
          ]
        }},
        "Omissions are inevitable; the Fusion Industry Association's annual survey counts dozens of companies and is the standard census [3]."
      ]
    },
    {
      h: "The five engineering gaps that actually decide the race",
      body: [
        { olist: [
          "<b>HTS magnet protection.</b> Quench detection in REBCO coated conductor is unsolved-at-scale, and every magnetic-confinement company inherits it.",
          "<b>Repetitive pulsed power.</b> Helion, Zap, General Fusion, and Pacific Fusion all need capacitor banks, switches, and magnetics that fire 10<sup>5</sup>–10<sup>8</sup> times between maintenance. Solid-state switching (thyristor/IGBT stacks, magnetic compression) versus spark gaps is a lifetime-versus-cost knife fight. This is the most underrated EE hiring area in fusion.",
          "<b>Tritium.</b> Any D-T plant must breed its own fuel in a lithium blanket at a tritium breeding ratio meaningfully above 1, with grams-scale inventory accounting under nuclear regulation. Only partially demonstrable before a real fusion neutron source exists.",
          "<b>14 MeV neutron materials.</b> Displacement damage and helium embrittlement data at fusion spectra are thin; a dedicated irradiation source (IFMIF-DONES class) lags the private schedules badly.",
          "<b>Power conversion.</b> Helion's direct induction recovery — plasma expansion pushing flux back through the compression coils, recaptured electrically — would skip the steam plant entirely if it works at scale; everyone else buys a conventional thermal balance-of-plant whose cost is well understood and stubbornly high."
        ]}
      ]
    },
    {
      h: "What I watch instead of press releases",
      body: [
        "Milestones with physical signatures: sustained D-T operation with measured neutron yield (not projections from hydrogen surrogates); integrated magnet operation at design field and temperature; pulsed-power platforms publishing shot counts and availability; third-party-verifiable electricity delivered, even milliwatts. And one economic signal — whether power purchase agreements survive their first schedule slip with terms intact.",
        "My honest position: the 2020s settle the physics question for at least one private approach; the 2030s settle whether any of them can run at capacity factor. The grid-integration consequences (firm clean power colocated with datacenter load) connect this board to <a href='board.html?b=power-grid'>EN-01</a> and the same buyer behavior shows up across clean-firm power generally."
      ]
    }
  ],
  references: [
    "H. Abu-Shawareb et al. (Indirect Drive ICF Collaboration), \"Lawson criterion for ignition exceeded in an inertial fusion experiment,\" <i>Phys. Rev. Lett.</i>, vol. 129, 075001, 2022.",
    "S. E. Wurzel and S. C. Hsu, \"Progress toward fusion energy breakeven and gain as measured against the Lawson criterion,\" <i>Phys. Plasmas</i>, vol. 29, 062103, 2022.",
    "Fusion Industry Association, <i>The Global Fusion Industry in 2025</i>, annual survey report, 2025.",
    "A. J. Creely et al., \"Overview of the SPARC tokamak,\" <i>J. Plasma Phys.</i>, vol. 86, no. 5, 2020.",
    "B. N. Sorbom et al., \"ARC: A compact, high-field fusion nuclear science facility and demonstration power plant,\" <i>Fusion Eng. Des.</i>, vol. 100, 2015.",
    "U. Shumlak, \"Z-pinch fusion,\" <i>J. Appl. Phys.</i>, vol. 127, 200901, 2020.",
    "J. Wesson, <i>Tokamaks</i>, 4th ed. Oxford: Oxford Univ. Press, 2011."
  ],
  discussion: [
    {
      date: "2026-03-20",
      body: [
        "Update (rev B): reorganized Table I around machine lineage after feedback-to-self that company lists rot fast but lineages stay legible. Also added the ITER and NIF anchor rows — private claims only make sense against the government baselines.",
        "Reading note: the Wurzel–Hsu Lawson chart [2] is the single most clarifying figure in the field. Every concept's demonstrated triple product, one axis system, no adjectives."
      ]
    },
    {
      date: "2026-05-10",
      body: [
        "News sweep (claims as reported, not verified by me): CFS continued SPARC commissioning toward first plasma and has been increasingly specific about a 2026 D-T campaign; Helion has stayed quiet on Polaris results since initial operations, which I read as neither good nor bad — pulsed programs iterate hardware in private; Proxima published more Stellaris engineering detail; stellarators in general had a strong year on paper. Treat all of this as dated the moment it is posted."
      ]
    },
    {
      date: "2026-06-02",
      body: [
        "Rev C: tightened the Q-definitions section after realizing my own Table I goal column mixed Q_plasma and net-electricity claims without flagging it. Now each goal row states the company's claim in its own terms. The discipline this survey is trying to maintain — record the claim, its date, and its kind — is most of the value of keeping it."
      ]
    }
  ]
});

