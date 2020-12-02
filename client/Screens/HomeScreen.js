import React from 'react';
import Crypto from "./Crypto";
import * as DocumentPicker from 'expo-document-picker';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import Firebase from "../Firebase"
import LocalStorage from "./LocalStorage";
import { ActivityIndicator, Platform, LogBox, StatusBar, StyleSheet, SafeAreaView, Switch, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, Image, Picker, ScrollView, Group, Alert, ToastAndroid } from 'react-native';
import { AntDesign, Entypo, Octicons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";


export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      user: {
        id: "ij1k7hXRgnWFrNsTzD6DfLQApfy2",
        name: "Anuj Jha"
      },
      id: "",
      Files: [],
      Secret: "",
    }
  }

  componentWillMount = async () => {
    LocalStorage.getItem("UserId", async (id) => {
      console.log(id);
      this.setState({ id: id })
      var documents = Firebase.firestore().collection("Users").doc(id);
      try {
        var docs = await documents.get();
        if (docs.exists) {
          await this.setState({ Files: docs.data().Files, Secret: docs.data().Secret });
        }
      } catch (err) {
        console.log(err)
      }
    })
  }

  showContent = async (file) => {
    this.props.navigation.navigate("Content", { file: file, id: this.state.id, Secret: this.state.Secret });
  }

  uploadToFirebase = async (uri, name, cb) => {
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
      .child(`${this.state.id}/${name}`);

    let snapshot = await ref.put(blob);

    cb();
  }

  UploadFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({});
    if (res.type == "success") {
      FileSystem.readAsStringAsync(res.uri, {
        encoding: FileSystem.EncodingType.UTF8,
      }).then(content => {
        Crypto.encrypt(content, this.state.Secret, async (result) => {
          await FileSystem.writeAsStringAsync(res.uri, result, { encoding: FileSystem.EncodingType.UTF8 })
            .then(() => {
              this.uploadToFirebase(res.uri, res.name, async () => {
                await FileSystem.writeAsStringAsync(res.uri, content, { encoding: FileSystem.EncodingType.UTF8 })
                var Files = this.state.Files;
                Files.push(res.name);
                this.setState({ Files: Files });
                await Firebase.firestore().collection("Users").doc(this.state.id).update({ Files: Files })
                ToastAndroid.show("Uploaded Successfully", ToastAndroid.SHORT);
              });
            })
        })
      })
    }
  }

  Logout=()=>{
    Firebase.auth().signOut().then(()=>{
      LocalStorage.removeItem("UserId");
      LocalStorage.setItem("isLogged","false");
      this.props.navigation.navigate("Login")
    })
  }

  render() {
    return (
      <View style={{ backgroundColor: "black", height: "100%" }}>
        <View style={{flexDirection:"row"}}>
          <Text style={{color:"red",fontWeight:"bold"}}>
            {this.state.id}
          </Text>
          <TouchableOpacity onPress={()=>this.Logout()} style={styles.Logout}>
            <Text style={{color:"white",fontWeight:"bold"}}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style={styles.Upload} onPress={() => this.UploadFile()} >
            <AntDesign name="addfile" size={20} color="white" />
            <Text style={{ color: "white", fontSize: 20 }}>Upload New File</Text>
          </TouchableOpacity>
        </View>
        <View>
          {
            this.state.Files.map((files, index) => {
              return (
                <View key={index} style={styles.MainContainer}>
                  <TouchableOpacity onPress={() => this.showContent(files)} style={{ flexDirection: "row" }}>
                    <AntDesign name="file1" size={22} color="blue" />
                    <Text style={{ marginLeft: 4, fontWeight: "bold", fontSize: 22, color: "blue" }}>{files}</Text>
                  </TouchableOpacity>
                </View>
              )
            })
          }
        </View>
      </View>
    );
  }

}

var styles = StyleSheet.create({
  Upload: {
    flexDirection: "row",
    marginHorizontal: 7,
    marginVertical: 5,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "cornflowerblue",
    borderRadius: 5,
  },
  MainContainer: {
    marginHorizontal: 4,
    marginVertical: 7,
    paddingVertical: 10,
    paddingHorizontal: 7,
    borderRadius: 5,
    backgroundColor: "cadetblue"
  },
  Logout:{
    paddingHorizontal:12,
    paddingVertical:7,
    borderRadius:5,
    backgroundColor:"chartreuse",
  }
})