import type { BranchSpec } from "./define";

export const GEOMETRY: BranchSpec = {
  id: "geometry",
  title: "Geometry",
  subtitle: "Shapes & Space",
  description: "Points, lines and angles, polygons and circles, area and volume, coordinates and transformations, building up to similarity and proof.",
  color: { main: "#ec4899", shadow: "#c22d78", ink: "#ffffff" },
  tier: 0,
  levels: [
    {
      title: "Points, Lines, Rays and Planes",
      topics:
        "Basic objects: points, lines, segments and rays; planes | Relationships: parallel and perpendicular lines; intersecting lines | Notation: naming lines and segments; measuring length",
    },
    {
      title: "Angles and Angle Relationships",
      topics:
        "Measuring angles: degrees and protractors; acute, right, obtuse, reflex | Angle facts: angles on a line; angles at a point; vertically opposite angles | Parallel lines: corresponding, alternate and co-interior angles",
    },
    {
      title: "Triangles and Their Properties",
      topics:
        "Classifying triangles: by sides; by angles | Angle sum: interior angles total 180°; exterior angle theorem | Congruence: SSS, SAS, ASA, RHS; triangle inequality",
    },
    {
      title: "Quadrilaterals and Polygons",
      topics:
        "Quadrilaterals: squares, rectangles, parallelograms, rhombuses, trapezia, kites | Polygons: regular and irregular; naming polygons | Polygon angles: interior angle sum; exterior angles",
    },
    {
      title: "Circles, Chords and Arcs",
      topics:
        "Parts of a circle: radius, diameter, chord, tangent, arc, sector | Measurements: circumference; arc length; sector area | Circle theorems: angle at the centre; angles in a semicircle; tangent properties",
    },
    {
      title: "Perimeter, Area, Surface Area and Volume",
      topics:
        "2D measurement: perimeter; area of rectangles, triangles, parallelograms, trapezia; circle area | 3D measurement: surface area of prisms; volume of prisms and cylinders | Units: converting area and volume units",
    },
    {
      title: "Coordinate Geometry and Transformations",
      topics:
        "Coordinates: plotting points; midpoint; distance between points | Transformations: translations; reflections; rotations; enlargements | Symmetry: line symmetry; rotational symmetry",
    },
    {
      title: "Advanced Geometry, Similarity and Proofs",
      topics:
        "Similarity: similar triangles; scale factors for length, area and volume | Proof: geometric reasoning; two-column proofs; proving congruence | Constructions: bisectors; loci",
    },
  ],
};
