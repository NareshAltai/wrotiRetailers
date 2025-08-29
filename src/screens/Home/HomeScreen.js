import React from "react";
import { View, Text, StatusBar, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Divider } from "react-native-paper";

import styles from "./Styles";

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();

  const theme = useTheme();
  const [address, setAddress] = React.useState("");

  const FirstRoute = () => (
    <View style={[styles.scene]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text>Home Screen</Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#F4F5F7"
        barStyle={theme.dark ? "light-content" : "dark-content"}
      />

      <View style={styles.locationContainer}>
        <View style={styles.locIconTextView}>
          <View>
            <Icon name="home-outline" size={32} />
          </View>
          <View style={styles.locTextView}>
            <Text style={styles.locTextLabel}>DashBoard</Text>
            <Text style={styles.locText}>
              {address.length > 30 ? address.substr(0, 30) + "..." : address}
            </Text>
          </View>
        </View>
        <View />
      </View>
      <Divider />
    </View>
  );
};

export default HomeScreen;
