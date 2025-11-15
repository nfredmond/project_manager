import { Resend } from "resend";

type NotificationPayload = {
  title: string;
  message: string;
};

const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM_EMAIL ?? "notifications@project-manager.app";
const alertRecipient = process.env.COMMUNITY_ALERT_EMAIL;

export async function dispatchEventNotification({ title, message }: NotificationPayload) {
  const tasks: Promise<unknown>[] = [];

  if (slackWebhookUrl) {
    tasks.push(
      fetch(slackWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: `*${title}*\n${message}` }),
      }).catch((error) => {
        console.error("Slack notification failed", error);
      }),
    );
  }

  if (resendApiKey && alertRecipient) {
    const resend = new Resend(resendApiKey);
    tasks.push(
      resend.emails.send({
        from: resendFrom,
        to: [alertRecipient],
        subject: title,
        text: message,
      }),
    );
  }

  if (tasks.length === 0) {
    console.info("No notification providers configured; skipping alert");
    return;
  }

  await Promise.allSettled(tasks);
}

