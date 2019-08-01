import CryptoJS from 'crypto-js';

class Secure {

  public signEncrypt = (message: string) => {
    const randomValue1: string = CryptoJS.lib.WordArray.random(128 / 8).toString();
    console.log('randomValue1: ', randomValue1);
    const randomValue2: string = CryptoJS.lib.WordArray.random(128 / 8).toString();
    console.log('randomValue2: ', randomValue2);
    const encrypted = CryptoJS.HmacSHA512(message, '');
    console.log('encrypted: ', encrypted);
    console.log('encrypted string: ', encrypted.toString());
    return encrypted.toString();
  }
}

export default new Secure();