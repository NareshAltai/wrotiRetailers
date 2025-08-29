import * as React from "react";
import { StyleSheet, Text, SafeAreaView } from "react-native";
import { Checkbox } from "react-native-paper";
const MyComponent = () => {
  const [checked, setChecked] = React.useState(true);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "row",
        marginLeft: 3.5,
      }}
    >
      <Checkbox
        status={checked ? "unchecked" : "checked"}
        onPress={() => {
          setChecked(!checked);
        }}
        color={"green"}
      />
      <Text style={{ marginTop: 9 }}>
        Do you want to give UPI payment link?
      </Text>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 3.5,
  },
});
export default MyComponent;
