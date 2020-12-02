import * as firebase from "firebase";

import 'firebase/firestore';

import firebaseConfig from "./FireBaseConfig.json"

let Firebase=firebase.initializeApp(firebaseConfig);

export default Firebase;