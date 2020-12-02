import React from 'react';
import { ActivityIndicator, StyleSheet, ToastAndroid, Switch, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, Image, Picker, ScrollView, Group, Alert, PermissionsAndroid } from 'react-native';
import { AntDesign, Entypo, Octicons, FontAwesome } from "@expo/vector-icons";
import Firebase from '../Firebase';
import { Audio } from 'expo-av';
import axios from "axios";
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import LocalStorage from "./LocalStorage";
import { decode, encode } from 'base-64'

if (!global.btoa) { global.btoa = encode }

if (!global.atob) { global.atob = decode }

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "Anuj",
            usernameColor: "white",
            emailError: "",
            micColor: "black",
            loading: false,
            response: "",
            recordata: "",
        }
        this.recording = null
    }

    componentDidMount = async () => {
        // LocalStorage.getItem("isLogged", (result) => {
        //     if (result == "true") {
        //         LocalStorage.getItem("UserId", (id) => {
        //             this.props.navigation.navigate("Home");
        //         })
        //     }
        // })
        
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

    _base64ToArrayBuffer = (base64) => {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.toString();
    }

    LoginSecurely = async () => {
        this.setState({ loading: true })
        var data={
            username:this.state.email.trim(),
            music:this.state.recordata
        }
        axios.post("http://192.168.0.106:5000/login",{data})
        .then(async res=>{
            if(res.data==1){
                // const documents = await Firebase.firestore().collection("Users").where("email", "==", this.state.email.trim());
                // documents.get().then(querySnapshot=>{
                //     querySnapshot.forEach(docs=>{
                //         LocalStorage.setItem("UserId", docs.id);
                //         LocalStorage.setItem("isLogged","true");
                //         this.props.navigation.navigate("Home");
                //     })
                // })
                LocalStorage.setItem("isLogged","true");
                this.props.navigation.navigate("Home");
            }else{
                ToastAndroid.show("Wrong Credentials!!!",ToastAndroid.SHORT)
            }
            this.setState({loading:false});
        }).catch(err=>{
            console.log(err);
        })
    }

    similarity = (s1, s2) => {
        var longer = s1;
        var shorter = s2;
        if (s1.length < s2.length) {
            longer = s2;
            shorter = s1;
        }
        var longerLength = longer.length;
        if (longerLength == 0) {
            return 1.0;
        }
        return (longerLength - this.editDistance(longer, shorter)) / parseFloat(longerLength);
    }

    editDistance = (s1, s2) => {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();

        var costs = new Array();
        for (var i = 0; i <= s1.length; i++) {
            var lastValue = i;
            for (var j = 0; j <= s2.length; j++) {
                if (i == 0)
                    costs[j] = j;
                else {
                    if (j > 0) {
                        var newValue = costs[j - 1];
                        if (s1.charAt(i - 1) != s2.charAt(j - 1))
                            newValue = Math.min(Math.min(newValue, lastValue),
                                costs[j]) + 1;
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0)
                costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    }

    render() {
        return (
            <View>
                <View style={{ marginVertical: 15 }}>
                    <TextInput
                        style={[styles.InputBox, { borderColor: this.state.usernameColor }]}
                        value={this.state.email}
                        placeholder="Username"
                        onFocus={() => this.setState({ usernameColor: "blue" })}
                        onBlur={() => this.setState({ usernameColor: "white" })}
                        onChangeText={(text) => this.setState({ email: text })}
                    />
                    <Text style={{ color: "red" }}>{this.state.emailError}</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                    <TouchableOpacity style={[styles.round]} onPressIn={() => this.record()} onPressOut={() => this.stop()}>
                        <FontAwesome name="microphone" size={24} color={this.state.micColor} />
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: "center" }}>
                    <TouchableOpacity disabled={this.state.loading} onPress={() => this.LoginSecurely()} style={{ justifyContent: "center", marginVertical: 10, padding: 10, borderRadius: 5, backgroundColor: "chartreuse", width: 200, flexDirection: "row" }}>
                        <Text style={{ color: "white", fontWeight: "bold" }}>LOGIN</Text>
                        {
                            this.state.loading ? <ActivityIndicator /> : <Text />
                        }
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

}

var styles = StyleSheet.create({
    InputBox: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderWidth: 2,
        borderRadius: 5,
        width: 250,
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
