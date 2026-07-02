const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,      // your Gmail: mealmitra.app@gmail.com
    pass: process.env.EMAIL_APP_PASS,  // Gmail App Password (not your real password)
  },
});
const sendOrderConfirmationEmail = async (user, order) => {
  const plan = order.planId;

  const mailOptions = {
    from: `"MealMitra" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Your MealMitra order is confirmed!",
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: auto; color: #1a1a1a;">
        <div style="background: #173f3b; padding: 24px 32px;">
          <h1 style="color: #dcefeb; margin: 0; font-size: 22px;">MealMitra</h1>
        </div>
        <div style="padding: 32px; background: #ffffff; border: 1px solid #e5e7eb;">
          <p style="font-size: 16px;">Hi <strong>${user.name}</strong>,</p>
          <p>Your order has been confirmed and payment received. Here are your details:</p>

          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <tr style="background: #f9fafb;">
              <td style="padding: 10px 14px; font-weight: 600;">Plan</td>
              <td style="padding: 10px 14px;">${plan.title}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; font-weight: 600;">Meal Type</td>
              <td style="padding: 10px 14px;">${plan.mealType}</td>
            </tr>
            <tr style="background: #f9fafb;">
              <td style="padding: 10px 14px; font-weight: 600;">Duration</td>
              <td style="padding: 10px 14px;">${plan.duration}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; font-weight: 600;">Amount Paid</td>
              <td style="padding: 10px 14px; color: #173f3b; font-weight: 700;">₹${plan.price}</td>
            </tr>
            <tr style="background: #f9fafb;">
              <td style="padding: 10px 14px; font-weight: 600;">Status</td>
              <td style="padding: 10px 14px;">
                <span style="background: #dcefeb; color: #173f3b; padding: 3px 10px; border-radius: 4px; font-size: 13px; font-weight: 600;">
                  Confirmed
                </span>
              </td>
            </tr>
          </table>

          <p style="color: #6b7280; font-size: 14px;">
            Your tiffin service will begin as per your selected plan. 
            You can track your order anytime from your dashboard.
          </p>

          <a href="${process.env.CLIENT_URL}/dashboard"
             style="display: inline-block; margin-top: 12px; background: #e9827c; color: #fff;
                    padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
            View Dashboard
          </a>
        </div>
        <p style="text-align: center; font-size: 12px; color: #9ca3af; padding: 16px;">
          © ${new Date().getFullYear()} MealMitra. Fresh, delivered.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Payment success email (separate minimal one if needed)
const sendPaymentSuccessEmail = async (user, amount, paymentId) => {
  const mailOptions = {
    from: `"MealMitra" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Payment received – MealMitra",
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: auto; color: #1a1a1a;">
        <div style="background: #173f3b; padding: 24px 32px;">
          <h1 style="color: #dcefeb; margin: 0; font-size: 22px;">MealMitra</h1>
        </div>
        <div style="padding: 32px; background: #ffffff; border: 1px solid #e5e7eb;">
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>We've received your payment of <strong>₹${amount / 100}</strong>.</p>
          <p style="color: #6b7280; font-size: 13px;">Payment ID: ${paymentId}</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const escapeHtml = (value) => String(value).replace(
  /[&<>"']/g,
  (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character]
);

const sendPasswordResetEmail = async (user, resetToken) => {
  const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");
  const resetUrl = `${clientUrl}/reset-password/${encodeURIComponent(resetToken)}`;

  await transporter.sendMail({
    from: `"MealMitra" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Reset your MealMitra password",
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: auto; color: #1a1a1a;">
        <div style="background: #173f3b; padding: 24px 32px;">
          <h1 style="color: #dcefeb; margin: 0; font-size: 22px;">MealMitra</h1>
        </div>
        <div style="padding: 32px; background: #ffffff; border: 1px solid #e5e7eb;">
          <p style="font-size: 16px;">Hi <strong>${escapeHtml(user.name)}</strong>,</p>
          <p>We received a request to reset your password. This link is valid for 15 minutes and can only be used once.</p>
          <a href="${resetUrl}"
             style="display: inline-block; margin: 16px 0; background: #173f3b; color: #fff;
                    padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
            Reset password
          </a>
          <p style="color: #6b7280; font-size: 14px;">
            If you did not request this, you can safely ignore this email. Your password will stay unchanged.
          </p>
        </div>
      </div>
    `,
    text: `Reset your MealMitra password using this link (valid for 15 minutes): ${resetUrl}`,
  });
};

module.exports = {
  sendOrderConfirmationEmail,
  sendPaymentSuccessEmail,
  sendPasswordResetEmail,
};
