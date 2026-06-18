const otpStore = new Map();

const generateOTP = (phone) => {
  const code = '123456'; // Mocked OTP for demo purposes
  otpStore.set(phone, { code, expiresAt: Date.now() + 5 * 60 * 1000 }); // 5 min expiry
  return code;
};

const verifyOTP = (phone, code) => {
  const stored = otpStore.get(phone);
  if (!stored) return false;
  if (stored.expiresAt < Date.now()) {
    otpStore.delete(phone);
    return false;
  }
  if (stored.code === code) {
    otpStore.delete(phone);
    return true;
  }
  return false;
};

const sendOTP = (phone) => {
  const code = generateOTP(phone);
  console.log(`[OTP] Sending ${code} to ${phone}`);
  return { success: true, message: 'OTP sent successfully' };
};

module.exports = { generateOTP, verifyOTP, sendOTP };
