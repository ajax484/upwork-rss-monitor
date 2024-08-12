// rss-monitor.js
const Parser = require("rss-parser");
const parser = new Parser();
require("dotenv").config();

let lastEntryDate = null;

async function checkForNewEntries() {
  try {
    const rssUrl = process.env.UPWORK_RSS_URL;

    if (!rssUrl) {
      throw new Error(
        "UPWORK_RSS_URL is not defined in the environment variables."
      );
    }

    console.log("Fetching RSS feed from:", rssUrl);

    const feed = await parser.parseURL(rssUrl);

    if (!feed || !feed.items) {
      throw new Error("Failed to retrieve valid RSS feed data.");
    }

    const newEntries = [];

    feed.items.forEach((item) => {
      const itemDate = new Date(item.isoDate);

      console.log(itemDate, lastEntryDate);

      if (!lastEntryDate || itemDate > lastEntryDate) {
        console.log("New entry found:", item.title);
        newEntries.push(item);
      }
    });

    if (newEntries.length > 0) {
      lastEntryDate = new Date(newEntries[0].isoDate);
    }

    return newEntries;
  } catch (error) {
    console.error("Error checking for new entries:", error.message);
    return [];
  }
}

module.exports = { checkForNewEntries };
