import type { BranchSpec } from "./define";

export const TRIGONOMETRY: BranchSpec = {
  id: "trigonometry",
  title: "Trigonometry",
  subtitle: "Angles & Ratios",
  description: "Connect angles to lengths with the Pythagorean theorem and trig ratios, then explore the unit circle, identities and waves.",
  color: { main: "#ff8a3d", shadow: "#d9661a", ink: "#ffffff" },
  tier: 0,
  prerequisite: { branchId: "geometry", level: 3 },
  levels: [
    {
      title: "Right Triangles and the Pythagorean Theorem",
      topics:
        "Right triangles: hypotenuse and legs; Pythagorean triples | The theorem: finding the hypotenuse; finding a shorter side | Applications: distance; 3D problems; checking for right angles",
    },
    {
      title: "Sine, Cosine and Tangent",
      topics:
        "Labelling: opposite, adjacent, hypotenuse | Ratios: SOH CAH TOA; finding sides | Inverse use: finding angles; angles of elevation and depression",
    },
    {
      title: "Special Angles and Exact Values",
      topics:
        "Special triangles: 30-60-90; 45-45-90 | Exact values: sin, cos, tan of 0°, 30°, 45°, 60°, 90° | Using exact values: surds in answers; simplifying expressions",
    },
    {
      title: "Radians and Unit Circle",
      topics:
        "Radians: degrees ⇄ radians; arc length and sector area in radians | Unit circle: coordinates as (cos θ, sin θ); all four quadrants | Reference angles: signs of trig functions; CAST",
    },
    {
      title: "Trigonometric Identities",
      topics:
        "Fundamental identities: sin²θ + cos²θ = 1; tan θ = sin θ / cos θ | Compound angles: sum and difference formulas; double-angle formulas | Proving identities: simplifying and transforming expressions",
    },
    {
      title: "Trigonometric Equations and Graphs",
      topics:
        "Graphs: sine, cosine and tangent graphs; amplitude, period, phase shift | Equations: solving in an interval; general solutions | Modelling: waves; periodic real-world data",
    },
    {
      title: "Inverse Trigonometry and Advanced Applications",
      topics:
        "Inverse functions: arcsin, arccos, arctan; restricted domains | Non-right triangles: sine rule; cosine rule; area = ½ab sin C | Applications: navigation and bearings; vectors and forces",
    },
  ],
};
