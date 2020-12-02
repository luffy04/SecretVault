import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, SafeAreaView,Switch , Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, Image, Picker, ScrollView, ToastAndroid } from 'react-native';
import { AntDesign, Entypo, Octicons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Firebase from '../Firebase';
import Crypto from "./Crypto";

export default class SignUp extends React.Component {
    constructor(props){
        super(props);
        this.state={
            text:""
        }
    }

    componentWillMount=async ()=>{
        const name=this.props.route.params.file;
        const id=this.props.route.params.id;
        var file=await Firebase.storage().ref(`${id}/${name}`).getDownloadURL();
        fetch(file)
        .then(async(response) =>{
            const text =await response.text();
            Crypto.decrypt(text,this.props.route.params.Secret,(result)=>{
                this.setState({text:result})
            })
        });
    }

    render() {
        return (
            <ScrollView style={{height:"100%",backgroundColor:"black"}}>
                <Text style={{color:"white",fontSize:19}}>{this.state.text}</Text>
            </ScrollView>
        );
    }
  
}

var styles=StyleSheet.create({
    
})