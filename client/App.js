import React from 'react';
import { ActivityIndicator, Platform  , StatusBar, StyleSheet , Text, View, TextInput, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign, Entypo, Octicons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import HomeScreen from "./Screens/HomeScreen";
import ContentScreen from "./Screens/Content";
import LoginScreen from "./Screens/LoginScreen";

const Stack=createStackNavigator();

export default class App extends React.Component {

  constructor(){
    super();
  }

  HomeTab=()=>{
    return(
      <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="File" component={HomeScreen}/>
        <Stack.Screen name="Content" component={ContentScreen}/>
      </Stack.Navigator>
    )
  }

  render() {
    console.disableYellowBox = true; 
    return (
     	<View style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,height:"100%",backgroundColor:"black" }}>
     	  <NavigationContainer>
          <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown:false}}>
            <Stack.Screen name="Home" component={this.HomeTab} />
            <Stack.Screen name="Login" component={LoginScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
     	</View>
    );
  } 
}