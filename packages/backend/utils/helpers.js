import CryptoJS from 'crypto-js';

/**
 * Encrypts the data using the crypto-js module.
 *
 * @param {string} data - Data to be encrypted
 */
export const encrypt = (data) => {
	return CryptoJS.AES.encrypt(data, process.env.CRYPTO_SECRET).toString();
};

/**
 * Decrypts the data using the crypto-js module.
 *
 * @param {string} data - Data to be decrypted
 */
export const decrypt = (data) => {
	return CryptoJS.AES.decrypt(data, process.env.CRYPTO_SECRET).toString(
		CryptoJS.enc.Utf8
	);
};
