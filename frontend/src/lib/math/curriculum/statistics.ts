import type { BranchSpec } from "./define";

export const STATISTICS: BranchSpec = {
  id: "statistics",
  title: "Statistics",
  subtitle: "Data & Evidence",
  description: "Collect, summarise and visualise data, measure spread, and use evidence to test claims and build models.",
  color: { main: "#0ea5e9", shadow: "#0a7fb5", ink: "#ffffff" },
  tier: 0,
  levels: [
    {
      title: "Types of Data and Data Visualization",
      topics:
        "Types of data: categorical and numerical; discrete and continuous | Charts: bar charts; pie charts; pictograms | Graphs: histograms; line graphs; choosing the right chart",
    },
    {
      title: "Mean, Median, Mode and Weighted Averages",
      topics:
        "Averages: mean; median; mode | Grouped data: averages from frequency tables; estimating the mean | Weighted averages: weights; when each average is best",
    },
    {
      title: "Range, Variance and Standard Deviation",
      topics:
        "Spread: range; interquartile range; box plots | Variance: deviations from the mean; computing variance | Standard deviation: meaning; comparing data sets",
    },
    {
      title: "Distributions, Percentiles and Normal Distribution",
      topics:
        "Distributions: shape, skew and outliers | Percentiles: quartiles; cumulative frequency | Normal distribution: the bell curve; 68-95-99.7 rule; z-scores",
    },
    {
      title: "Sampling, Surveys and Experimental Design",
      topics:
        "Sampling: populations and samples; random, stratified and systematic sampling | Bias: sources of bias; good survey questions | Experiments: control groups; randomisation; observational vs experimental studies",
    },
    {
      title: "Hypothesis Testing and Confidence Intervals",
      topics:
        "Hypotheses: null and alternative; significance level | Testing: test statistics; p-values; type I and type II errors | Confidence intervals: margin of error; interpreting intervals",
    },
    {
      title: "Correlation, Regression and Statistical Models",
      topics:
        "Correlation: scatter plots; correlation coefficient; correlation vs causation | Regression: line of best fit; least squares; residuals | Models: interpolation and extrapolation; evaluating models",
    },
  ],
};
