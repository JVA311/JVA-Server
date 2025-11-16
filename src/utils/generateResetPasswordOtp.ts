
export const generateResetPasswordOtp = () => {
  // Generates a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Expire in 10 mins
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  return { otp, expiresAt };
};
