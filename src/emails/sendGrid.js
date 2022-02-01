import sgMail from "@sendgrid/mail";
import { html } from "./html.js";
import { passwordHtml } from "./passwordHtml.js";
import { passwordResetHtml } from "./passwordResetHtml.js";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL;
sgMail.setApiKey(SENDGRID_API_KEY);

export const sendWelcomeMail = async (email, name, link) => {
  const msg = {
    to: email,
    from: SENDER_EMAIL,
    subject: "Welcome to the App",
    html: `${html(name, SENDER_EMAIL, link)}`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

export const sendCancelationMail = async (email, name) => {
  const msg = {
    to: email,
    from: SENDER_EMAIL,
    subject: "GOODBYE",
    text: `Goodbye ${name}. is there anything we could have done to have kept you along with the app`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

export const sendRecoverPasswordMail = async (email, name, link) => {
  const msg = {
    to: email,
    from: SENDER_EMAIL,
    subject: "Password Change Request",
    html: `${passwordHtml(name, SENDER_EMAIL, link)}`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

export const resetPasswordMail = async (email, name) => {
  const msg = {
    to: email,
    from: SENDER_EMAIL,
    subject: "Password has been reseted",
    html: `${passwordResetHtml(name, SENDER_EMAIL, email)}`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
