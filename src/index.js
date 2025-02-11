const { Octokit } = require("@octokit/rest");

module.exports = {
  analyzeCommits: async (pluginConfig, context) => {
    const {commits, logger} = context;
    for (const commit of commits) {
      const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
      });

      const base = pluginConfig.repositoryUrl.split("github.com/")[1];
      const owner = base.split("/")[0];
      const repo = base.split("/")[1]?.replace(".git", "");

      const author= await octokit.request("GET /repos/{owner}/{repo}/commits/{ref}", {
        owner: owner,
        repo: repo,
        ref: commit.commit.long,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      if (author) {
        const userLink = `by [@${author.data.author.login}](https://github.com/${author.data.author.login})`;
        const commitWithContributor = `${commit.message.trim()} ${userLink} (${commit.commit.short})`;

        // TODO Commit message get not updated
        commit.message = commitWithContributor;
        // Should look like this:
        console.log("###################################################")
        console.log(commitWithContributor);
        console.log("###################################################")
      } else {
        console.log(`No username found for commit ${commit.commit.long}`);
      }
    }

  },
};
