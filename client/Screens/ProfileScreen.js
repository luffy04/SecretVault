import React from 'react';
import { ActivityIndicator,  StyleSheet,  Text, View, TextInput, Image,TouchableOpacity, ScrollView, ToastAndroid } from 'react-native';
import { AntDesign, Entypo, Octicons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Firebase from '../Firebase';
import LocalStorage from "./LocalStorage";
import * as ImagePicker from 'expo-image-picker';

export default class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state={
            profile_image:"",
            loading:true,
            logout:false,
            User:JSON.parse(this.props.User)
        }
    }

    componentWillMount=async ()=>{
        var profile_image=await Firebase.storage().ref(`profile/${this.state.User.id}.png`).getDownloadURL();
        this.setState({profile_image:profile_image,loading:false})
    }

    uploadImageToFirebase = async (uri,cb) => {

        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                resolve(xhr.response);
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });
    
        const ref = Firebase
            .storage()
            .ref()
            .child(`profile/QlIBSrA1MZaFn4OrhJCZSRs9sgw2.png`);
    
        let snapshot = await ref.put(blob);
    
        var profile=await Firebase.storage().ref(`profile/${this.state.User.id}`).getDownloadURL();
        cb(profile)
    };

    changeProfile=async ()=>{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [2, 2],
            quality: 1,
        });
        
        if(!result.cancelled){
            var uploadUri = Platform.OS === 'ios' ? result.uri.replace('file://', '') : result.uri;
            
            this.uploadImageToFirebase(uploadUri,(result)=>{
                this.setState({profile_image:result,loading:false})
            });
        }
    }

    Logout=()=>{
        Firebase.auth().signOut()
        .then(()=>{
            var value=LocalStorage.removeItem("isLogged");
            if(value!=null){
                this.props.removeUser();
                ToastAndroid.show("Logged Out",ToastAndroid.SHORT);
            }
        }).catch(err=>{
            console.log(err)
        })
    }

    render() {
        return (
            <View style={{backgroundColor:"black",height:"100%",paddingVertical:20,paddingHorizontal:12}}>
                <View style={{flexDirection:"row"}}>
                    <View style={{alignItems:"center",width:"30%"}}>
                        <View style={{position:"relative"}}>
                            <Image style={{width:60,height:60,borderRadius:60}} source={{uri:this.state.profile_image}}/>
                            {
                                this.state.loading?<ActivityIndicator  style={{position:"absolute",justifyContent:"center"}}/>:<Text />
                            }
                        </View>
                        <TouchableOpacity onPress={()=> this.changeProfile()}>
                            <Text style={{fontWeight:"bold",color:"red"}}>Change Image</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{justifyContent:"center",flexDirection:"row",width:"70%"}}>
                        <View>
                            <Text style={{alignItems:"center",fontSize:22,color:"orange"}}>0</Text>
                            <Text style={{color:"blue"}}>Posts</Text>
                        </View>

                        <View>
                            <Text style={{alignItems:"center",fontSize:22,color:"white"}}>0</Text>
                            <Text style={{color:"blue"}}>Pending</Text>
                        </View>

                        <View>
                            <Text style={{fontSize:22,color:"green"}}>0</Text>
                            <Text style={{color:"blue"}}>Completed</Text>
                        </View>
                    </View>
                </View>
                <View style={{alignItems:"center"}}> 
                    <TouchableOpacity disabled={this.state.loading} onPress={()=> this.Logout()} style={{justifyContent:"center",marginVertical:10,padding:10,borderRadius:5,backgroundColor:"chartreuse",width:200,flexDirection:"row"}}>
                        <Text style={{color:"white",fontWeight:"bold"}}>LOGOUT</Text>
                        {/* {
                            this.state.logout?<ActivityIndicator />:<Text />
                        } */}
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
    }
})