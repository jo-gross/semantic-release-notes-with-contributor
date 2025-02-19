import resolveConfig from "./lib/resolve-config.js";
import { SemanticReleaseOctokit, toOctokitOptions } from "./lib/octokit.js";

export async function analyzeCommits(pluginConfig, context, { Octokit = SemanticReleaseOctokit } = {}) {
  const {
    githubToken,
    githubUrl,
    githubApiPathPrefix,
    githubApiUrl,
    proxy,
    ...options
  } = resolveConfig(pluginConfig, context);

  // Create Octokit instance
  const octokit = new Octokit(
    toOctokitOptions({
      githubToken,
      githubUrl,
      githubApiPathPrefix,
      githubApiUrl,
      proxy,
    }),
  );
}