// This code sample uses the 'node-fetch' library:
// https://www.npmjs.com/package/node-fetch
import fetch from "node-fetch";

interface IJiraIssue {
  id: string;
  title: string;
  key: string;
  type: string;
  status: string;
  url: string;
}

interface IConfluencePage {
  id: string;
  title: string;
  type: string;
  status: string;
  url: string;
}

class AtlassianApi {
  private domain: string;
  private authorization: string;

  constructor(
    domain: string | undefined,
    email: string | undefined,
    token: string | undefined
  ) {
    if (typeof domain === "undefined") {
      throw new Error("domain is undefined");
    }
    if (typeof email === "undefined") {
      throw new Error("email is undefined");
    }
    if (typeof token === "undefined") {
      throw new Error("token is undefined");
    }

    const authorization = `Basic ${Buffer.from(`${email}:${token}`).toString(
      "base64"
    )}`;

    this.authorization = authorization;
    this.domain = domain;
  }

  private buildHeaders = (customHeaders = {}) => {
    return {
      Authorization: this.authorization,
      Accept: "application/json",
      ...customHeaders,
    };
  };

  public getJiraIssue = (issueId: string): Promise<IJiraIssue> => {
    const filterData = (json: any) => ({
      id: json.id,
      key: json.key,
      type: json.fields.issuetype.name,
      title: json.fields.summary,
      status: json.fields.status.name,
      url: `https://${this.domain}/browse/${json.key}`,
    });
    return new Promise((resolve, reject) => {
      fetch(`https://${this.domain}/rest/api/3/issue/${issueId}`, {
        method: "GET",
        headers: this.buildHeaders(),
      })
        .then((response) => response.json())
        .then((json) => filterData(json))
        .then((text) => resolve(text))
        .catch((err) => reject(err));
    });
  };

  getConfluencePage = (pageId: string): Promise<IConfluencePage> => {
    return new Promise((resolve, reject) => {
      const filterData = (json: any) => ({
        id: json.id,
        title: json.title,
        status: json.status,
        type: json.type,
        url: `${json._links.base}${json._links.webui}`,
      });

      fetch(`https://${this.domain}/wiki/rest/api/content/${pageId}`, {
        method: "GET",
        headers: this.buildHeaders(),
      })
        .then((response) => response.json())
        .then((json) => filterData(json))
        .then((json) => resolve(json))
        .catch((err) => reject(err));
    });
  };
}

export default AtlassianApi;

// const api = new AtlassianApi(ATLASSIAN_DOMAIN, ATLASSIAN_EMAIL, ATLASSIAN_TOKEN);
//
// api.Confluence.Wiki.Get("891289811").then(data => console.log(data))
// api.Jira.Issue.Get("DEV-23427").then(data => console.log(data))
//
