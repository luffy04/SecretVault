import CryptoJS from "react-native-crypto-js";

encrypt=async (text,secret_key,cb)=>{
    let CipherText= await CryptoJS.AES.encrypt(text,secret_key).toString();
    cb(CipherText);
}

encryptObject=async (text,secret_key,cb)=>{
    let ciphertext =await CryptoJS.AES.encrypt(JSON.stringify(text), secret_key).toString();
    cb(ciphertext);
}

decrypt=async (text,secret_key,cb)=>{
    let bytes  =await CryptoJS.AES.decrypt(text, secret_key);
    let originalText = await bytes.toString(CryptoJS.enc.Utf8);
    cb(originalText);
}

module.exports={
    encrypt,
    encryptObject,
    decrypt,
}