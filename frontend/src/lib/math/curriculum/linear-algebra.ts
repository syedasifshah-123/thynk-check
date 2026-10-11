import type { BranchSpec } from "./define";

export const LINEAR_ALGEBRA: BranchSpec = {
  id: "linear-algebra",
  title: "Linear Algebra",
  subtitle: "Vectors & Matrices",
  description: "Vectors, matrices and the linear maps between spaces: the language behind graphics, data science and machine learning.",
  color: { main: "#6366f1", shadow: "#4547c9", ink: "#ffffff" },
  tier: 0,
  prerequisite: { branchId: "algebra", level: 3 },
  levels: [
    {
      title: "Vectors and Vector Operations",
      topics:
        "Vectors: magnitude and direction; column notation | Operations: addition and subtraction; scalar multiplication | Products: dot product; angle between vectors",
    },
    {
      title: "Matrices and Matrix Operations",
      topics:
        "Matrices: dimensions; entries; special matrices | Operations: addition; scalar multiplication; transpose | Matrix multiplication: row-by-column rule; non-commutativity",
    },
    {
      title: "Systems of Linear Equations",
      topics:
        "Matrix form: Ax = b; augmented matrices | Gaussian elimination: row operations; row echelon form | Solutions: unique, infinite or none; geometric meaning",
    },
    {
      title: "Determinants and Matrix Inverses",
      topics:
        "Determinants: 2×2 and 3×3; area and volume scaling | Inverses: inverse of a 2×2 matrix; invertibility | Applications: solving systems with inverses; Cramer's rule",
    },
    {
      title: "Vector Spaces, Span and Basis",
      topics:
        "Vector spaces: axioms; subspaces | Span and independence: linear combinations; linear independence | Basis and dimension: coordinates; rank and nullity",
    },
    {
      title: "Eigenvalues and Eigenvectors",
      topics:
        "Eigen-equation: Av = λv; geometric meaning | Computing: characteristic polynomial; finding eigenvectors | Diagonalisation: diagonal form; powers of matrices",
    },
    {
      title: "Linear Transformations and Applications",
      topics:
        "Transformations: matrices as maps; rotations, reflections, shears | Composition: combining transformations; kernel and image | Applications: computer graphics; Markov chains; least squares",
    },
  ],
};
