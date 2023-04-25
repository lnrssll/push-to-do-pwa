# Push To Do

Based on @shl iOS demo from earlier today (https://twitter.com/shl/status/1650565032181387264)

Recreated it as a React PWA for all mobile operating systems (Android, iOS, etc)

There is no database behind this, though it would be pretty trivial to add

Right now, it prompts the user for an OpenAI API key, a Notion token, and a Notion page ID (or URL), then stashes them in local storage (no user accounts)

Technically, there's no easy way to verify that the deployed app isn't stealing your API keys, but here's the code... You could fork it and host on vercel for free (if you have the skills and don't trust random people on the internet)

Scaffolded with create-t3-app (https://t3.gg) but removing most of it for this demo
