# Giphy Browser

This is a simple Giphy front-end built with React and Redux. There are three pages:

* `/` Shows an infinitely loading list of "trending" gifs
* `/search?q=My+search+string` Shows search an infinitely loading list of search results for "My search string"
* `/gif/:id` Shows the single gif matching the id in the pathname

## Setup

You will need to configure your environment to get started:

```
cp .env.sample .env
```

Make sure to update the `REACT_APP_API_KEY` env var in the `.env` file.

## Starting Points

I used `create-react-app` as a starting point and I took a lot of `redux`/`connected-react-router` boilerplate from the `connected-react-router` examples: https://github.com/supasate/connected-react-router/tree/master/examples

## Design Decisions

* Setup a `configuration.js` file to consolidate configuration definitions, avoid magic numbers, and handle different environments. This form of configuration file is something I picked up from a colleague a few years ago and have been using various iterations of it ever since.
* Setup a `Giphy` service to handle interfacing with the giphy api and http
* Arrange redux code into "features" in one file per feature. This is a personal preference. I find that redux often leads you to create many tiny files to define actions, action types, generators, and initial state. Importing and exporting all of these things causes you to type the names of everything over and over, and I find it more convenient to group everything into one "feature" file and export what you need to export from there.
* Factor out a redux "generator" to help reduce repeated boilerplate code for similar redux features. I've worked on projects that do and don't do this. Sometimes it can get out of hand when you start carving out exceptions in the generator code. There may be times where it makes sense to start this way, and then migrate away from it as the feature grows. In cases like this where the features are almost identical it helps reduce repetition and reduces your bug surface area.
* "Virtualize" long lists of content with `react-virtualized` to keep rendering speeds reasonable in the context of infinite scrolling—there's no need to render off-screen content.
* Process infinite scrolling "load next page" requests on a queue (I just used `async.queue`) to prevent rapid requests from running concurrently, from returning out of order, or from running on incorrect `offset`.
* Prefer `webp` format images over `gifs` when they are supported! This is supported by Chrome and now Firefox, and I think IE supports it too, and it significantly reduces network load.
* I created a dumb module at `utils/timeago.js` for the express purpose of mocking the date/time in tests—since `node-time-ago` exports a function directly, it's difficult to mock with `sinon`.

## Further work

* I hacked around an issue in `GifList.js` where a user could load a page of content on a large screen and be unable to load subsequent pages for the lack of scroll-ability. I decided to just set up an interval and just keep loading content until the window is full at component mount time. This is probably not ideal. Alternative solutions could be to try to estimate the number of gifs needed to fill the screen before making the first request by measuring the window size, or even simply adding a "load more" button for the first subsequent page load. This is a product decision that would probably need to be made in the context of other requirements, so I just went with a fairly "dumb" solution and moved on.
* I used standard css for everything—which I honestly like for its simiplicity, but this may not be a wise decision for maintainability in the long run. Some of the React-centric styling tools with automatic component-level prefixing for example can go a long way towards maintainability. I've used Sass and Stylus and the like over the years and they're all fine. I just decided to keep this simple.
* Further styling, there are a number of things in here that are not well styled: error messages, loading messages, the `MissingPage` component, etc.
* This could use some further tests. I added some fairly simple unit tests for the service and redux code, and some snapshot tests for the components, but further testing around user-interactions would be good.
