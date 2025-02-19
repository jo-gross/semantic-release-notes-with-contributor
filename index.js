import resolveConfig from "./lib/resolve-config.js";
import { SemanticReleaseOctokit, toOctokitOptions } from "./lib/octokit.js";
import parseGitHubUrl from "./lib/parse-github-url.js";

export async function analyzeCommits(pluginConfig, context, { Octokit = SemanticReleaseOctokit } = {}) {
  const {
    githubToken,
    githubUrl,
    githubApiPathPrefix,
    githubApiUrl,
    proxy
  } = resolveConfig(pluginConfig, context);

  const { commits, options: { repositoryUrl } } = context;

  const { owner, repo } = parseGitHubUrl(repositoryUrl);

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

  // Get Author of each commit
  /** `repository` response object looks like this:
    commita349fc8: {
      oid: 'a349fc8fde64fa88ad8d82b8ccbb9c235cec8049',
      author: { user: login: "username" }
    },
    commit456af10: {
      oid: '456af108e8fe97833d2df552a31476d4c9dc74b5',
      author: { user: login: "username" }
    }
   */
  const { repository } = await octokit.graphql(buildGetGHReleaseCommitsAuthorsQuery(
    commits.map((commit) => commit.commit)), 
    { owner, repo }
  );

  // NEXT - DO SOMETHING WITH THE AUTHOR INFO
  console.log(repository);
}

/**
 * Build GraphQL query to get the Github author of each commit
 * @param {Array<{short: string, long: string}>} commits 
 * @returns {string} GraphQL query
 */
function buildGetGHReleaseCommitsAuthorsQuery(commits) {
  return `#graphql
    query getGHReleaseCommitsAuthors($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        ${commits
          .map((sha) => {
            return `commit${sha.short}: object(oid: "${sha.long}") {
              ...on Commit {
                oid
                author {
                  user {
                    login
                  }
                }
              }
            }`;
          })
          .join("")}
      }
    }
  `;
}