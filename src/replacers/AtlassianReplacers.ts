import path from "path";
import fs from "fs";
import dotenv from "dotenv";

const dotenvpath = path.join(__dirname, ".env");
if (fs.existsSync(dotenvpath)) {
  dotenv.config({ path: dotenvpath });
}

import { IReplacer, Global } from "../types";
import { getOuterStrings } from "./helpers";
import AtlassianApi from "../api/AtlassianApi";

if (typeof (global as Global).wackyCache === "undefined") {
  (global as Global).wackyCache = { jira: {}, confluence: {} };
}
const cache = (global as Global).wackyCache;

const atlassian = (() => {
  try {
    return {
      ok: true,
      api: new AtlassianApi(
        process.env.ATLASSIAN_DOMAIN,
        process.env.ATLASSIAN_EMAIL,
        process.env.ATLASSIAN_TOKEN
      ),
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      api: null,
      error,
    };
  }
})();

const api = atlassian.api;

const atlassianReplacers: IReplacer[] = [
  {
    pattern: /\[\[(https:\/\/helpphocassoftware\.atlassian\.net\/browse\/(.*))\]\]/i,
    execute: function (markdown, result) {
      const [preMatchStr, postMatchStr] = getOuterStrings(markdown, result);
      const url = result[1];
      const jiraKey = result[2];

      let description;
      if (api === null) {
        description = "api problems";
      } else {
        if (typeof cache.jira[jiraKey] === "undefined") {
          // fetch from network

          try {
            api
              .getJiraIssue(jiraKey)
              .then(function (issue) {
                cache.jira[jiraKey] = issue.title;
              })
              .catch(function (_reason) {
                cache.jira[jiraKey] = "error fetching from Jira";
              });
            description = "fetching from Jira...";
          } catch (error) {
            description = "err: " + error;
          }
        } else {
          description = cache.jira[jiraKey];
        }
      }
      const newMarkdown = `${preMatchStr}<a href="${url}" class="jira-task" title="via Jira">${jiraKey}: ${description}</a>${postMatchStr}`;
      return newMarkdown;
    },
  },
  {
    pattern: /\[\[(https:\/\/helpphocassoftware\.atlassian\.net\/wiki\/spaces\/([~A-Za-z0-9\+_\-]+\/)*pages\/([0-9]+)\/.*)\]\]/i,
    execute: function (markdown, result) {
      const [before, after] = getOuterStrings(markdown, result);
      const link = result[1];
      const confluenceId = result[result.length - 1]; // the last match is our id

      // check the cache is ok (a bit of a hack)
      if (typeof cache.confluence === "undefined") {
        cache.confluence = {};
      }

      let description;
      if (typeof cache.confluence[confluenceId] !== "undefined") {
        description = cache.confluence[confluenceId];
      } else {
        if (api === null) {
          description = "api is null";
        } else {
          description = "fetching from Confluence...";
          api
            .getConfluencePage(confluenceId)
            .then(function (page) {
              cache.confluence[confluenceId] = page.title;
            })
            .catch(function (_reason) {
              cache.confluence[confluenceId] =
                "error fetching data from Confluence";
            });
        }
      }

      return `${before}<a href="${link}" title="via Confluence" class="confluence-page">${description}</a>${after}`;
    },
  },
];

export default atlassianReplacers;
