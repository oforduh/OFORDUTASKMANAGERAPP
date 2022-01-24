import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL;
sgMail.setApiKey(SENDGRID_API_KEY);

export const sendWelcomeMail = async (email, name) => {
  const msg = {
    to: email,
    from: SENDER_EMAIL,
    subject: "Welcome to the App",
    text: `welcome to the app ${name}. let me know how you can get along with the app`,
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
