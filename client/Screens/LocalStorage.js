import Crypto from "./Crypto";
import {AsyncStorage} from "react-native";

getItem=async (key,cb)=>{
    let text=await AsyncStorage.getItem(key);
    Crypto.decrypt(text,"Cristiano Ronaldo",(result)=>{
        cb(result)
    })
}

setItemObject = (key,value)=>{
    Crypto.encryptObject(value,"Cristiano Ronaldo",(result)=>{
        AsyncStorage.setItem(key,result);
        return result;
    })
}

setItem = (key,value)=>{
    Crypto.encrypt(value,"Cristiano Ronaldo",(result)=>{
        AsyncStorage.setItem(key,result)
        return result;
    })
}

removeItem=async (key)=>{
    try{
        await AsyncStorage.removeItem(key);
        return true;
    }catch(exception){
        return false;
    }
    
}

module.exports={
    getItem,
    setItemObject,
    setItem,
    removeItem
}