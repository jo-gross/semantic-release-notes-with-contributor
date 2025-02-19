import { isNil } from "lodash-es";

export default function resolveConfig(
  {
    githubUrl,
    githubApiUrl,
    githubApiPathPrefix,
    proxy,
  },
  { env },
) {
  return {
    githubToken: env.GH_TOKEN || env.GITHUB_TOKEN,
    githubUrl: githubUrl || env.GH_URL || env.GITHUB_URL,
    githubApiPathPrefix:
      githubApiPathPrefix || env.GH_PREFIX || env.GITHUB_PREFIX || "",
    githubApiUrl: githubApiUrl || env.GITHUB_API_URL,
    proxy: isNil(proxy) ? env.http_proxy || env.HTTP_PROXY || false : proxy,
  };
}
