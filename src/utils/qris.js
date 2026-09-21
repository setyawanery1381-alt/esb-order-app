import QRCode from 'qrcode';

// Official SANGCREATOR DIGITAL Raw QRIS Payload (NMID: ID1026536961000)
export const SANGCREATOR_BASE_QRIS = 
  "00020101021126570011ID.DANA.WWW011893600915303278497102090327849710303UMI51440014ID.CO.QRIS.WWW0215ID10265369610000303UMI5204549953033605802ID5919SANGCREATOR DIGITAL6011Kota Bekasi610517134";

/**
 * Calculates CRC16-CCITT (False / polynomial 0x1021, init 0xFFFF)
 * strictly complying with Bank Indonesia & ASPI QRIS EMVCo specifications.
 */
export function calculateCRC16(str) {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= (str.charCodeAt(i) << 8);
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Generates a standard Indonesian QRIS Dinamis payload with exact transaction amount.
 * When scanned by BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay, etc.,
 * the app immediately displays the exact amount so the customer doesn't have to type it.
 *
 * @param {number} amount - Total tagihan in IDR (e.g. 42000)
 * @param {string} orderId - Optional order / reference ID (e.g. 'ORD-123456')
 * @returns {string} Dynamic QRIS string with Tag 54 (Amount) and updated CRC16
 */
export function buildDynamicQRISString(amount, orderId = '') {
  const roundedAmount = Math.max(0, Math.round(amount || 0));
  if (roundedAmount <= 0) {
    return SANGCREATOR_BASE_QRIS + "6304BE69";
  }

  // 1. Point of Initiation Method: 11 (Static) -> 12 (Dynamic)
  let qris = SANGCREATOR_BASE_QRIS.replace("010211", "010212");

  // 2. Format Amount Tag 54 (Length = 2 digits, Value = nominal)
  const amountStr = roundedAmount.toString();
  const tag54 = `54${amountStr.length.toString().padStart(2, '0')}${amountStr}`;

  // 3. Insert Tag 54 immediately after Currency Tag 5303360 (IDR)
  const currencyTag = "5303360";
  const currencyIdx = qris.indexOf(currencyTag);
  if (currencyIdx !== -1) {
    const insertIdx = currencyIdx + currencyTag.length;
    qris = qris.slice(0, insertIdx) + tag54 + qris.slice(insertIdx);
  }

  // 4. Additional Data Tag 62 (Optional Bill/Order reference)
  if (orderId) {
    const cleanOrderId = orderId.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 20);
    const subtag01 = `01${cleanOrderId.length.toString().padStart(2, '0')}${cleanOrderId}`;
    const tag62 = `62${subtag01.length.toString().padStart(2, '0')}${subtag01}`;
    qris += tag62;
  }

  // 5. Append Tag 63 (Length 04) and calculate CRC16
  const payloadBeforeCRC = qris + "6304";
  const checksum = calculateCRC16(payloadBeforeCRC);

  return payloadBeforeCRC + checksum;
}

/**
 * Generates high-resolution Data URL for the dynamic QR code
 */
export async function getDynamicQRISDataURL(amount, orderId = '') {
  const payload = buildDynamicQRISString(amount, orderId);
  try {
    return await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 400,
      color: {
        dark: '#111827',
        light: '#FFFFFF',
      },
    });
  } catch (err) {
    console.error('Failed to generate dynamic QRIS DataURL', err);
    return null;
  }
}
