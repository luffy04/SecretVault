import React from 'react';
import { ActivityIndicator, Platform, LogBox , StatusBar, StyleSheet, SafeAreaView,Switch , Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, Image, Picker, ScrollView, Group, Alert, ToastAndroid } from 'react-native';
import { AntDesign, Entypo, Octicons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Firebase from '../Firebase';
import axios from "axios";
import { Audio } from 'expo-av';
import LocalStorage from "./LocalStorage"
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';

export default class SignUp extends React.Component {
    constructor(props){
        super(props);
        this.state={
            username:"Anuj",
            email:"aryanjha82.aj55@gmail.com",
            secret:"Ronaldo",
            password:"123456",
            confirmpassword:"123456",
            usernameColor:"white",
            emailColor:"white",
            secretColor:"white",
            passwordColor:"white",
            confirmpasswordColor:"white",
            usernameError:"",
            emailError:"",
            secretError:"",
            passError:"",
            confirmpassError:"",
            recordata:"",
            loading:false
        }
    }

    componentDidMount=async ()=>{
        FileSystem.readAsStringAsync("./results.csv").then(data=>console.log(data)).catch(err=>console.log(err));

        const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        if (response.status === 'granted') this.setState({ response: "granted" });
        else ToastAndroid.show("Permission Denied", ToastAndroid.SHORT);
    }

    record = async () => {

        if (this.state.response === 'granted') {
            this.setState({ micColor: "green" });
            this.recording = new Audio.Recording();
            try {
                await this.recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
                await this.recording.startAsync();
            } catch (err) {
                console.log(err);
            }
        } else {
            ToastAndroid.show("Permission Denied", ToastAndroid.SHORT);
        }
    }

    stop = async () => {
        this.setState({ micColor: "black" })
        try {
            await this.recording.stopAndUnloadAsync();
            const info = await FileSystem.readAsStringAsync(this.recording.getURI(), { encoding: FileSystem.EncodingType.Base64 });
            await this.setState({ recordata: info });
        } catch (err) {
            console.log(err);
        }
    }

    createUser=(id,cb)=>{
        var documents=Firebase.firestore().collection("Users").doc(id);
        documents.set({
            email:this.state.email.trim(),
            Secret:this.state.secret.trim(),
            Files:[]
        })
        cb();
    }

    Create=()=>{
        var username=this.state.username.trim();
        var email=this.state.email.trim();
        var secret=this.state.secret.trim();
        var password=this.state.password.trim();
        var confirmpassword=this.state.confirmpassword.trim();
        if(username.length==0){
            this.setState({usernameError:"*Username cannot be empty"})
            setTimeout(()=>{
                this.setState({usernameError:""})
            },3000)
            return;
        }
        if(email.length==0){
            this.setState({emailError:"*Email cannot be empty"})
            setTimeout(()=>{
                this.setState({emailError:""})
            },3000)
            return;
        }
        if(secret.length==0){
            this.setState({secretError:"*Secret cannot be empty"})
            setTimeout(()=>{
                this.setState({secretError:""})
            },3000)
            return;
        }
        if(password.length==0){
            this.setState({passError:"*Password cannot be empty"})
            setTimeout(()=>{
                this.setState({passError:""})
            },3000)
            return;
        }
        if(password!=confirmpassword){
            this.setState({confirmpassError:"*Password does not match"})
            setTimeout(()=>{
                this.setState({confirmpassError:""})
            },3000)
            return;
        }
        this.setState({loading:true})
        Firebase.auth().createUserWithEmailAndPassword(email,password)
        .then((result)=>{
            LocalStorage.setItem("isLogged","true");
            LocalStorage.setItem("UserId",result.user.uid);
            var data={
                music:this.state.recordata,
                username:this.state.username.trim()
            }
            this.createUser(result.user.uid,()=>{
                axios.post("http://192.168.0.106:5000/signUp",{data})
                .then(res=>{
                    this.setState({loading:false});
                    this.props.navigation.navigate("Home",{uid:result.user.uid});
                    ToastAndroid.show("Created!!",ToastAndroid.SHORT);
                })
            })
        }).catch(err=>{
            this.setState({loading:false});
            ToastAndroid.show("Account already exists!", ToastAndroid.SHORT);
        });
    }

    render() {
        return (
            <View>
                <View style={{marginVertical:15}}>
                    <TextInput 
                        style={[styles.InputBox,{borderColor:this.state.usernameColor}]}
                        value={this.state.username}
                        placeholder="Username"
                        onFocus={()=>this.setState({usernameColor:"blue"})}
                        onBlur={()=>this.setState({usernameColor:"white"})}
                        onChangeText={(text)=>this.setState({username:text})}
                    />
                    <Text style={{color:"red"}}>{this.state.emailError}</Text>
                </View>
                <View style={{marginVertical:15}}>
                    <TextInput 
                        style={[styles.InputBox,{borderColor:this.state.emailColor}]}
                        value={this.state.email}
                        placeholder="Email"
                        onFocus={()=>this.setState({emailColor:"blue"})}
                        onBlur={()=>this.setState({emailColor:"white"})}
                        onChangeText={(text)=>this.setState({email:text})}
                    />
                    <Text style={{color:"red"}}>{this.state.emailError}</Text>
                </View>
                <View style={{marginVertical:15}}>
                    <TextInput 
                        style={[styles.InputBox,{borderColor:this.state.secretColor}]}
                        value={this.state.secret}
                        placeholder="Secret"
                        onFocus={()=>this.setState({secretColor:"blue"})}
                        onBlur={()=>this.setState({secretColor:"white"})}
                        onChangeText={(text)=>this.setState({secret:text})}
                    />
                    <Text style={{color:"red"}}>{this.state.secretError}</Text>
                </View>
                <View style={{marginVertical:15}}>
                    <TextInput 
                        style={[styles.InputBox,{borderColor:this.state.passwordColor}]}
                        value={this.state.password}
                        placeholder="Password"
                        onFocus={()=>this.setState({passwordColor:"blue"})}
                        onBlur={()=>this.setState({passwordColor:"white"})}
                        onChangeText={(text)=>this.setState({password:text})}
                        secureTextEntry={true}
                    />
                    <Text style={{color:"red"}}>{this.state.passError}</Text>
                </View>
                <View style={{marginVertical:15}}>
                    <TextInput 
                        style={[styles.InputBox,{borderColor:this.state.confirmpasswordColor}]}
                        value={this.state.confirmpassword}
                        placeholder="Confirm Password"
                        onFocus={()=>this.setState({confirmpasswordColor:"blue"})}
                        onBlur={()=>this.setState({confirmpasswordColor:"white"})}
                        onChangeText={(text)=>this.setState({confirmpassword:text})}
                        secureTextEntry={true}
                    />
                    <Text style={{color:"red"}}>{this.state.confirmpassError}</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                    <TouchableOpacity style={[styles.round]} onPressIn={() => this.record()} onPressOut={() => this.stop()}>
                        <FontAwesome name="microphone" size={24} color={this.state.micColor} />
                    </TouchableOpacity>
                </View>
                <View style={{alignItems:"center"}}> 
                    <TouchableOpacity disabled={this.state.loading} onPress={()=> this.Create()} style={{justifyContent:"center",marginVertical:10,padding:10,borderRadius:5,backgroundColor:"chartreuse",width:200,flexDirection:"row"}}>
                        <Text style={{color:"white",fontWeight:"bold"}}>CREATE</Text>
                        {
                            this.state.loading?<ActivityIndicator />:<Text />
                        }
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
  
}

var styles=StyleSheet.create({
    InputBox:{
        paddingVertical:8,
        paddingHorizontal:10,
        borderWidth:2,
        borderRadius:5,
        width:250,
    },
    round: {
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "red"
    }
})