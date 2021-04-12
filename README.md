# Dendron Wackylinks

_Better Dendron integration with Jira, Confluence, and GitHub._

**STATUS: NOT READY YET**

## Goals

This project aims to enhance [Dendron's](https://dendron.so) wikilinks feature by fetching extra information from external APIs. Currently, this project hooks into the custom CSS and custom parser functionality of Dendron's Markdown Preview Enhanced (MPE) plugin.

## Installation

### Building

The instructions provided here assume that you have `yarn` installed. If not, you can install it with `npm --global i yarn` or just use `npm`.

Clone and build the project sources:

```bash
git clone git@github.com:jpsheehan-phocas/dendron-wackylinks.git
cd dendron-wackylinks
yarn
yarn run build
```

### Parser

You'll need to modify the parser so that wackylinks can be run. From Visual Studio Code, bring up the command palette (press Ctrl+Shift+P, or Cmd+Shift+P on Mac), and type "Markdown Preview Enhanced: Extend Parser".
At the top of this file you will need to import the wackylinks parser:

```javascript
const wackylinks = require("/the/absolute/path/to/dendron-wackylinks/dist/index.js");
```

If you're on Windows you may need to use a double-backslash `\\\\` to represent the path seperator.

Then edit the `onWillParseMarkdown` function so that it reads:

```javascript
onWillParseMarkdown: function(markdown) {
  return new Promise((resolve, reject) => {
    markdown = wackylinks(markdown);
    return resolve(markdown);
  });
},
```

### Styling

This step is optional but will make things look a little neater. You can even do your own custom styles if you wish.
Open up the command palette from within Visual Studio Code and type "Markdown Preview Enhanced: Customize CSS".
This will bring up a CSS file where you can create custom styles.
The CSS file provided by Wackylinks will:

- Style the Jira links as a red info panel.
- Style the Confluence links as a blue info panel.
- Style the GitHub links as a green info panel.
- Style the hashtags as a grey info panel.

Simply copy the contents of the `src/wackylinks.css` into this CSS file, or create your own 😀!

## Upgrading

This project can be upgraded by running the following commands:

```bash
git pull
yarn
yarn run build
```

You may then follow the instructions under the CSS installation section to upgrade the CSS if you wish.

## Configuration

This project uses environment variables to provide API secrets. You can specify these in the `dist/.env` file, via command line arguments, or by leveraging the system's environment variables.

The following variables should be set:

| Variable         | Description                                                                                                          |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- |
| ATLASSIAN_DOMAIN | The domain name of your Atlassian service. E.g. `example.atlassian.net`                                              |
| ATLASSIAN_EMAIL  | The email address of your Atlassian account.                                                                         |
| ATLASSIAN_TOKEN  | The Atlassian API token that you'll need to [generate](https://id.atlassian.com/manage-profile/security/api-tokens). |

### .env

Create an empty file `.env` in the `dist` directory.

TODO: write the rest of this

### Command Line

TODO: write instructions for bash and powershell

## Usage

Once you've followed the instructions in the previous sections, you should be able to simply paste your Jira, Confluence, and GitHub links into Dendron as wikilinks and they will be inserted into the Markdown Preview window with extra information.
For example:

```markdown
[[https://example.atlassian.net/browse/ABC-12345]]
```

Is transformed into:

```markdown
<a href='https://example.atlassian.net/browse/ABC-12345' title='via Jira' class='jira-ticket'>ABC-12345: My Fake Ticket Title</a>
```

The behaviour is similar for Confluence wiki pages and GitHub links.

### Hashtags

You can also insert tags into your pages as wikilinks. As long as they start with `tags`.
For example:

```markdown
[[tags.example]]
```

Will be replaced with:

```markdown
[[example|tags.example]]
```

And if you use the default CSS file, it will appear as "#example" on the page.
