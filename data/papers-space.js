/* ============================================================
   BenchtopBuild — papers-space.js
   Threads for the Space & Geophysics section.
   (Thread template: see top of papers-ops.js)
   ============================================================ */

/* ------------------------------------------------------------
   GE-01 · Geomagnetism & Earth Observation
   ------------------------------------------------------------ */

PAPERS.push({
  id: "gp-2026-0014",
  board: "geomagnetism",
  kind: "REVIEW",
  pinned: false,
  rev: "B",
  title: "Watching the Outer Core From Orbit: Satellite Magnetometry and the Pacific Flow Reversal",
  posted: "2026-06-07",
  updated: "2026-06-10",
  tags: ["swarm", "magnetometry", "geodynamo", "core-flow", "secular-variation", "fluxgate"],
  abstract: "Three thousand kilometers beneath your feet, a shell of molten iron the size of Mars circulates and, by doing so, runs the planet's original electrical machine: the geodynamo. We cannot sample it, image it acoustically in any detail, or wait long enough for it to repeat itself — but its magnetic field leaks out, and for nearly three decades a succession of satellites has measured that field to sub-nanotesla precision. This review covers the instrument stack that makes those measurements possible, the inverse problem that turns magnetic snapshots into maps of core-surface flow, and the result that prompted this thread: University of Edinburgh researchers, analyzing 1997–2025 data from the Swarm constellation and its predecessors, report that a broad current of molten iron beneath the equatorial Pacific reversed direction around 2010 — switching from weak westward to strong eastward flow, possibly in step with reported changes in the inner core [1].",
  sections: [
    {
      h: "The geodynamo is an electrical machine",
      body: [
        "Earth's outer core is a spherical shell of liquid iron alloy, roughly 2,260 km thick, convecting as the planet sheds heat. A conducting fluid moving through a magnetic field induces currents; those currents generate magnetic field; with the right geometry, the loop closes and self-excites. It is a homopolar generator the size of a small planet, and every term in its governing magnetohydrodynamic equations is something an electrical engineer has met before — induction, diffusion, back-EMF — just at a Reynolds number that ruins any hope of a lumped model.",
        "Two properties matter for this thread. First, the field changes: the slow drift called secular variation, with occasional abrupt accelerations ('geomagnetic jerks') that no model predicts well. Second, on timescales of years, the core fluid behaves approximately as a perfect conductor, so field lines are 'frozen into' the flow — which means changes in the observed field encode the motion of the fluid that carries it. Watch the field carefully enough and the core draws its own weather map [2]."
      ]
    },
    {
      h: "Measuring a planet to a part in a hundred thousand",
      body: [
        "The field at low-Earth orbit is tens of microtesla; the science lives in changes of a few nanotesla per year. The instrument architecture that achieves this has been stable since Ørsted (Denmark, 1999) and refined through CHAMP (Germany, 2000–2010) and ESA's three-satellite Swarm constellation (2013–present) [3], [4]:",
        { list: [
          "<b>A vector fluxgate magnetometer</b> measures the field's direction and magnitude on three axes — precise but drift-prone, so it cannot be trusted alone for absolute accuracy.",
          "<b>An absolute scalar magnetometer</b> (proton/Overhauser on earlier missions, optically pumped helium on Swarm) measures total field magnitude against atomic physics itself, drift-free, and continuously calibrates the fluxgate's scale.",
          "<b>Star trackers mounted on the same optical bench</b> as the fluxgate tie the vector measurement to inertial space — attitude error converts directly into field-component error, so the mechanical stability of that bench is as important as the magnetometers.",
          "<b>A several-meter boom</b> carries the sensors away from the spacecraft body, because the satellite itself — torquer coils, solar-array currents, battery loops — is the loudest magnetic source in the neighborhood. Magnetic cleanliness programs budget every current loop on the vehicle."
        ]},
        { fig: {
          id: "fig1",
          caption: "Fig. 1. Approximate amplitude of contributions to the field measured at ~450 km altitude (log scale). The core field dominates absolutely, but the science targets — its year-scale changes — sit at the nanotesla level, below crustal anomalies and storm-time external fields, which must be modeled and removed.",
          svg: "<svg viewBox='0 0 680 250' xmlns='http://www.w3.org/2000/svg' role='img' aria-label='Log-scale amplitudes of magnetic field sources at satellite altitude'><style>.bar{stroke:none}.lb{font:11px var(--mono);fill:var(--ink-2)}.lb2{font:10px var(--mono);fill:var(--ink-3)}.ax{stroke:var(--ink-3);stroke-width:1}</style><line class='ax' x1='150' y1='20' x2='150' y2='210'/><line class='ax' x1='150' y1='210' x2='660' y2='210'/><text class='lb2' x='160' y='226'>0.1 nT</text><text class='lb2' x='280' y='226'>10 nT</text><text class='lb2' x='400' y='226'>1 µT</text><text class='lb2' x='520' y='226'>100 µT</text><rect class='bar' x='150' y='30' width='460' height='20' fill='var(--copper)'/><text class='lb' x='144' y='44' text-anchor='end'>core field</text><rect class='bar' x='150' y='62' width='240' height='20' fill='var(--ink-3)'/><text class='lb' x='144' y='76' text-anchor='end'>crustal anomalies</text><rect class='bar' x='150' y='94' width='300' height='20' fill='var(--ink-3)'/><text class='lb' x='144' y='108' text-anchor='end'>external (storms)</text><rect class='bar' x='150' y='126' width='190' height='20' fill='var(--cyan)'/><text class='lb' x='144' y='140' text-anchor='end'>secular variation /yr</text><rect class='bar' x='150' y='158' width='90' height='20' fill='var(--ink-3)'/><text class='lb' x='144' y='172' text-anchor='end'>instrument noise</text><text class='lb2' x='350' y='144' fill='var(--cyan)'>◀ the signal of interest</text></svg>"
        }},
        "A detail I find elegant: the field of usable data has been stretched backward and forward by calibrating <i>platform</i> magnetometers — the workaday attitude-control fluxgates on satellites like CryoSat — well enough to contribute to science. Recovering geophysics from instruments never meant for it is peak measurement engineering, and it is part of how the 1997–2025 span behind the Edinburgh study was assembled [1], [4]."
      ]
    },
    {
      h: "From field maps to core weather",
      body: [
        "Separating sources is the first inverse problem: the measured field is expanded in spherical harmonics, where the core dominates low degrees (up to roughly degree 13) and the crust dominates above; time behavior separates ionospheric and magnetospheric contributions. Models in the IGRF/CHAOS families encode this decomposition [5].",
        "The second inverse problem is the interesting one. Under the frozen-flux approximation, the radial induction equation at the core–mantle boundary links the observed rate of change of the radial field to the horizontal flow advecting it. Inverting that relation for the flow is formally non-unique — flows along contours of constant field produce no signature — so physical regularization (large-scale, quasi-geostrophic assumptions) selects among solutions [2]. The resulting 'core weather maps' resolve features thousands of kilometers across, evolving over years: a westward equatorial jet under the Atlantic, a high-latitude circulation, and waves riding the field itself, including the magneto-Coriolis waves identified in Swarm data in 2022 [6]."
      ]
    },
    {
      h: "The 2010 Pacific reversal",
      body: [
        "The result that prompted this thread: Frederik Dahl Madsen and colleagues at the University of Edinburgh's School of GeoSciences, applying principal component analysis to the multi-mission record (Ørsted, CHAMP, CryoSat, Swarm; 1997–2025), report that a broad region of core fluid beneath the equatorial Pacific switched from weak westward motion to strong eastward motion around 2010, peaked, and has since been weakening [1]. The eastward flow's rise is described as contemporaneous with a reported change in inner-core behavior, hinting at coupling between the inner core and the fluid shell around it — exactly the kind of cross-boundary dynamics that single-mission snapshots could never have caught.",
        "Two things impress me about this result as a measurement story rather than a geophysics story. First, it required stitching instruments across nearly three decades, four missions, and two generations of magnetometer technology into one self-consistent record — a calibration problem more than an observation problem. Second, the signal was extracted by PCA: the reversal announces itself as a dominant mode in the data, not as a model-dependent inference. When a structure that large changes direction in your principal components, you are allowed to believe it.",
        "Caveats the authors and the announcement are careful about, and so will I be: flow inversion non-uniqueness doesn't vanish because the dataset is long; 'contemporaneous with inner-core changes' is a correlation across two difficult inferences; and a 15-year transient in a system with century-scale memory resists tidy interpretation. The honest summary is that the Pacific hemisphere of the core did something large and directional, recently, and we have the instruments to watch what it does next."
      ]
    },
    {
      h: "Why an engineer should care",
      body: [
        "Navigation runs on models of this field. The World Magnetic Model and IGRF — the lookup tables inside every smartphone compass, aircraft system, and directional-drilling rig — are forecasts of secular variation, and unexpected core behavior (jerks, accelerating jets, hemispheric reversals like this one) is precisely what degrades them between scheduled updates [5]. The 2019 out-of-cycle WMM update happened because the field outran the forecast.",
        "Slow changes in the geomagnetic environment also set the boundary conditions for geomagnetically induced currents — quasi-DC currents driven through long transmission lines during storms, which saturate transformer cores and have ended badly before (Québec, 1989). The grid-side view belongs to <a href='board.html?b=power-grid'>EN-01</a>, and a thread on GIC modeling is on the list.",
        "And the instrument story is a syllabus by itself: fluxgate design, optically pumped magnetometry, magnetic cleanliness budgeting, multi-decade cross-calibration. A bench-scale fluxgate build is queued for <a href='board.html?b=embedded'>CS-02</a> — partly because of this paper."
      ]
    }
  ],
  references: [
    "F. D. Madsen et al., reported in \"Insights into Earth's molten outer core from space,\" University of Edinburgh School of GeoSciences news, 2026. Online: geosciences.ed.ac.uk/news-and-events/news/insights-into-earths-molten-outer-core-from-space",
    "R. Holme, \"Large-scale flow in the core,\" in <i>Treatise on Geophysics</i>, 2nd ed., vol. 8, Elsevier, 2015.",
    "E. Friis-Christensen, H. Lühr, and G. Hulot, \"Swarm: A constellation to study the Earth's magnetic field,\" <i>Earth, Planets and Space</i>, vol. 58, pp. 351–358, 2006.",
    "N. Olsen and C. Stolle, \"Satellite geomagnetism,\" <i>Annu. Rev. Earth Planet. Sci.</i>, vol. 40, pp. 441–465, 2012.",
    "P. Alken et al., \"International Geomagnetic Reference Field: the thirteenth generation,\" <i>Earth, Planets and Space</i>, vol. 73, 2021.",
    "N. Gillet, F. Gerick, D. Jault, T. Schwaiger, J. Aubert, and M. Istas, \"Satellite magnetic data reveal interannual waves in Earth's core,\" <i>Proc. Natl. Acad. Sci.</i>, vol. 119, no. 13, 2022."
  ],
  discussion: [
    {
      date: "2026-06-08",
      body: [
        "Instrument rabbit hole from the magnetic-cleanliness reading: on this class of mission, the solar array harness is routed in compensated loops so the current's magnetic moment cancels, and the battery loops are budgeted the same way. The spacecraft is designed like a precision analog board — minimize loop areas, control return paths — at the scale of a bus you could stand on. Same discipline as precision mixed-signal PCB layout, four orders of magnitude larger."
      ]
    },
    {
      date: "2026-06-10",
      body: [
        "Rev B: corrected my description of the scalar magnetometer's role — it calibrates the fluxgate's scale factor; it does not 'correct drift in real time' as rev A sloppily said. Added the explicit caveat paragraph to §IV after re-reading the announcement's own hedging. Also: the planned bench fluxgate thread is now sketched — ring-core sensor, second-harmonic detection, which conveniently exercises single-bin Goertzel tone detection."
      ]
    }
  ]
});

