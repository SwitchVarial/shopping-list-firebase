import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  FlatList,
  Keyboard,
  Alert,
} from "react-native";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  push,
  ref,
  onValue,
  update,
  remove,
} from "firebase/database";
import { Ionicons } from "@expo/vector-icons";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDykIELVq1VtrOaDlisV0whrL5_Ir9Bzm8",
  authDomain: "shopping-list-e3b45.firebaseapp.com",
  databaseURL:
    "https://shopping-list-e3b45-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "shopping-list-e3b45",
  storageBucket: "shopping-list-e3b45.appspot.com",
  messagingSenderId: "164762227783",
  appId: "1:164762227783:web:5a23310c76c43577ebcd62",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function App() {
  const [product, setProduct] = useState();
  const [amount, setAmount] = useState();
  const [list, setList] = useState([]);

  useEffect(() => {
    const itemsRef = ref(database, "items/");
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setList(Object.values(data));
      } else {
        setList([]);
      }
    });
  }, []);

  const addItem = () => {
    if (product !== undefined && amount !== undefined) {
      Keyboard.dismiss();
      const newRef = push(ref(database, "items/"));
      const newKey = newRef.key;
      const newItem = {
        product: product,
        amount: amount,
        id: newKey,
      };
      update(ref(database, "items/" + newKey), newItem);
      setProduct();
      setAmount();
    } else {
      Alert.alert("Product and Amount are required fields!");
    }
  };

  const deleteItem = (id) => {
    remove(ref(database, "items/" + id));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.control}>
        <TextInput
          style={styles.input}
          placeholder="Product"
          onChangeText={(product) => setProduct(product)}
          value={product}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          onChangeText={(amount) => setAmount(amount)}
          value={amount}
        />
        <Pressable style={styles.button} onPress={addItem}>
          <View style={styles.row}>
            <Text style={styles.buttontext}>Add +</Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.list}>
        <Text style={styles.title}>Shopping List</Text>
        {list.length > 0 && (
          <FlatList
            style={styles.text}
            data={list}
            renderItem={({ item, index }) => {
              return (
                <View style={styles.row}>
                  <Text style={styles.text}>
                    {item.product}, {item.amount}
                  </Text>
                  <Pressable
                    style={styles.doneButton}
                    onPress={() => deleteItem(item.id)}
                  >
                    <Ionicons name="trash-sharp" size={24} color="steelblue" />
                  </Pressable>
                </View>
              );
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "powderblue",
    alignItems: "center",
  },
  control: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 60,
  },
  list: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 20,
  },
  row: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: "100%",
  },
  input: {
    margin: 7,
    width: "90%",
    padding: 15,
    backgroundColor: "white",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 7,
    width: "90%",
    padding: 15,
    backgroundColor: "steelblue",
  },
  doneButton: {
    marginLeft: 7,
  },
  buttontext: {
    fontSize: 20,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  title: {
    fontSize: 30,
    marginBottom: 15,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "steelblue",
  },
  text: {
    fontSize: 20,
    color: "steelblue",
  },
  deleteText: {
    fontSize: 20,
    color: "white",
  },
});
