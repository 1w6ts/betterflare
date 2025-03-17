import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { resend } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, 
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #000;
      background-color: #f6f6f6;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
      background-color: #fff;
    }
    .email-wrapper {
      background-color: white;
      border-radius: 5px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      padding: 40px;
    }
    .logo {
      margin-bottom: 30px;
      text-align: center;
    }
    .logo img {
      height: 40px;
    }
    h1 {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #000;
    }
    p {
      font-size: 16px;
      margin-bottom: 24px;
      color: #666;
    }
    .button {
      display: inline-block;
      background-color: #000;
      color: #fff;
      text-decoration: none !important;
      padding: 12px 30px;
      border-radius: 5px;
      font-weight: 500;
      margin-bottom: 24px;
      text-align: center;

    }
    .button:hover {
      background-color: #333;
    }
    .verification-link {
      font-size: 14px;
      color: #666;
      word-break: break-all;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 14px;
      color: #999;
    }
    .divider {
      border-top: 1px solid #eaeaea;
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-wrapper">
      <div class="logo">
        <img src="https://i.imgur.com/brnpQJZ.png" alt="Zeitgeist Logo">
      </div>
      
      <h1>Verify your email address</h1>
      
      <p>Thanks for signing up for Betterflare! Please verify your email address by clicking the button below.</p>
      
      <a href="${url}" class="button">Verify Email Address</a>
      
      <p>If you didn't create an account with Zeitgeist, you can safely ignore this email.</p>
      
      <div class="divider"></div>
      
      <p>If the button above doesn't work, copy and paste this link into your browser:</p>
      <div class="verification-link">${url}</div>
      
      <div class="footer">
        <p>© ${new Date().getFullYear()} Zeitgeist. All rights reserved.</p>
        <p>Betterflare by Zeitgeist</p>
      </div>
    </div>
  </div>
</body>
</html>`;

      await resend.emails.send({
        from: "Betterflare <betterflare@zeitgeist.sh>",
        to: user.email,
        subject: "Verify your Betterflare account",
        html: htmlContent,
      });
    },
  },
});
