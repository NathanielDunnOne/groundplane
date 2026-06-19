/* ============================================================
   GROUNDPLANE — site.js
   Site identity + board structure. Edit this file to rename
   the site, change the operator, or add sections and boards.

   To add a board: add an object to a section's `boards` array.
     slug  — short id used in URLs (board.html?b=slug). No spaces.
     code  — printed reference designator, any short string.
     name  — display name.
     blurb — one-line description shown on the index.

   To add a section: copy a whole section block.
   Threads live in data/papers-*.js and point at a board slug.
   ============================================================ */

window.SITE = {
  name: "GROUNDPLANE",
  tagline: "Research & Projects Forum of ND",
  owner: {
    handle: "ND",
    name: "ND",
    role: "Admin",
    affiliation: "Independent Research & Project Notes"
  },
  // Used in citations and the masthead. Set to your real URL after deploying.
  canonicalUrl: "https://nathanieldunnone.github.io/groundplane",

  sections: [
    {
      id: "ops",
      title: "Operations",
      boards: [
        {
          slug: "bulletin",
          code: "OPS-00",
          name: "Bulletin",
          blurb: "What this forum is, how it works, and site changelog."
        }
      ]
    },
    {
      id: "energy",
      title: "Energy Systems",
      boards: [
        {
          slug: "power-grid",
          code: "EN-01",
          name: "Power Systems & Smart Grid",
          blurb: "Generation, transmission, inverter-based resources, grid control and protection."
        },
        {
          slug: "fusion",
          code: "EN-02",
          name: "Fusion Energy",
          blurb: "Confinement physics for engineers, HTS magnets, pulsed power, and the private fusion industry."
        },
        {
          slug: "geothermal",
          code: "EN-03",
          name: "Geothermal Power",
          blurb: "EGS, closed-loop systems, advanced drilling, downhole electronics, and power conversion."
        }
      ]
    },
    {
      id: "geophysics-space",
      title: "Geophysics & Space",
      boards: [
        {
          slug: "geomagnetism",
          code: "GE-01",
          name: "Geomagnetism & Earth Observation",
          blurb: "Satellite magnetometry, the geodynamo, core flow, and what orbit tells us about the deep Earth."
        },
        {
          slug: "lunar-planetary",
          code: "SP-01",
          name: "Lunar & Planetary Exploration",
          blurb: "Surface power and thermal design, radiation-tolerant electronics, landers and instruments."
        }
      ]
    },
    {
      id: "circuits",
      title: "Circuits & Systems",
      boards: [
        {
          slug: "rf-comms",
          code: "CS-01",
          name: "RF & Communications",
          blurb: "Antennas, measurement, SDR, link budgets, EMC."
        },
        {
          slug: "embedded",
          code: "CS-02",
          name: "Embedded Systems & Firmware",
          blurb: "Microcontrollers, RTOS behavior, drivers, timing, and debugging."
        },
        {
          slug: "pcb",
          code: "CS-03",
          name: "PCB Design & Hardware",
          blurb: "Stackups, layout discipline, signal integrity, bring-up notes."
        },
        {
          slug: "controls",
          code: "CS-04",
          name: "Control Systems",
          blurb: "Loop design, tuning, anti-windup, plant modeling."
        },
        {
          slug: "dsp",
          code: "CS-05",
          name: "DSP & Signal Processing",
          blurb: "Filters, transforms, fixed-point arithmetic, detection."
        },
        {
          slug: "robotics",
          code: "CS-06",
          name: "Robotics & Mechatronics",
          blurb: "Sensor fusion, actuation, estimation, and small mobile platforms."
        }
      ]
    }
  ]
};

/* Threads register themselves here from data/papers-*.js */
window.PAPERS = [];
