import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  // service: "Gmail", // Hoặc dịch vụ email khác như Outlook, SendGrid, v.v.
  auth: {
    user: process.env.EMAIL_USER, // Email của bạn (lưu trong .env)
    pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng (App Password nếu dùng Gmail)
  },
});

export const sendEmail = async (to, subject, text) => {
  console.log(process.env.EMAIL_USER);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", to);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export default transporter;
