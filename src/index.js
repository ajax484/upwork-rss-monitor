// index.js
const { checkForNewEntries } = require("./rss-monitor");
const TelegramBot = require("node-telegram-bot-api");
const cron = require("node-cron");
require("dotenv").config();

const telegramChatId = process.env.TELEGRAM_CHAT_ID;
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;

if (!telegramChatId) {
  console.error(
    "TELEGRAM_CHAT_ID is not defined in the environment variables."
  );
  process.exit(1); // Exit the process with an error code
}

if (!telegramBotToken) {
  console.error(
    "TELEGRAM_BOT_TOKEN is not defined in the environment variables."
  );
  process.exit(1); // Exit the process with an error code
}

const bot = new TelegramBot(telegramBotToken, { polling: false });

async function notifyNewEntries() {
  try {
    const newEntries = await checkForNewEntries();

    if (newEntries.length > 0) {
      newEntries.forEach((entry) => {
        const message = `⚠️⚠️⚠️\n\nNew Job: ${entry.title}\n\nLink: ${
          entry.link
        }\n\n*Description*:\n${entry.contentSnippet}`;
        bot
          .sendMessage(telegramChatId, message)
          .then(() => {
            console.log("Message sent successfully:", entry.title);
          })
          .catch((error) => {
            console.error("Error sending message to Telegram:", error.message);
          });
      });
    } else {
      console.log("No new entries found.");
    }
  } catch (error) {
    console.error("Error during notifyNewEntries:", error.message);
  }
}

// Schedule the job to run every 10 minutes
cron.schedule("*/10 * * * *", () => {
  console.log("Running scheduled job: Checking for new entries...");
  notifyNewEntries();
});

// Initial run
notifyNewEntries();
