import React from 'react';
import Login from "./Login";
import SignUp from "./SignUp";
import LocalStorage from "./LocalStorage";
import { ActivityIndicator, Platform, LogBox, StatusBar, StyleSheet, SafeAreaView, Switch, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, Image, Picker, ScrollView, Group, Alert } from 'react-native';
import { AntDesign, Entypo, Octicons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";


export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fontSizeLogin: 40,
            fontSizeSign: 28,
            show: true
        }
    }

    componentWillMount=()=>{
        LocalStorage.getItem("isLoggedIn",(result)=>{
            if(result=="true")this.props.navigation.navigate("Home");
        });
    }

    render() {
        var setUser = this.props.setUser;
        return (
            <View style={{ height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: "dimgray" }}>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity onPress={() => this.setState({ show: true, fontSizeLogin: 32, fontSizeSign: 28 })}>
                        <Text style={{ color: "mediumseagreen", fontSize: this.state.fontSizeLogin }}>Login</Text>
                    </TouchableOpacity>
                    <Text style={{ fontWeight: "bold", fontSize: 40, color: "blue" }}> / </Text>
                    <TouchableOpacity onPress={() => this.setState({ show: false, fontSizeLogin: 28, fontSizeSign: 32 })}>
                        <Text style={{ color: "fuchsia", fontSize: this.state.fontSizeSign }}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    {
                        this.state.show ?
                            <Login navigation={this.props.navigation}/> :
                            <SignUp navigation={this.props.navigation}/>
                    }
                </View>
            </View>
        );
    }

}
