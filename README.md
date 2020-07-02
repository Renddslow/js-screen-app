# js-screen-app

> A simple screening tool for gauging a candidate's exposure to your tech stack.

## Install

```
$ yarn add js-screen-app
```

## Storage

All responses are stored in a private git repository as flat JSON files. The repository is structured thus:

```
/
| --- <id>/
|       | --- responses/
|       |       | --- <responseId>
|       | --- manifest.json
|       | --- settings.json
| --- <email-address>.json
```

The manifest contains information about the user of the survey, identified by the top-level `id`. The manifest contains:

```json
{
  "id": "<id>",
  "ownerEmail": "mubatt@wyopub.com",
  "viewers": [],
  "created": "2020-06-30T09:30:00Z"
}
```

Similarly, each email address has an associated JSON file with a simple array of survey IDs. If the email address is the owner or a viewer on any survey, that survey ID should be represented in the array.
