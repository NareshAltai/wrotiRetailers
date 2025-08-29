import React from "react";
import { Dimensions } from "react-native";
import { Snackbar } from "react-native-paper";

const HEIGHT = Dimensions.get("window").height;

const Toast = (props) => {
  // message - message on the toast
  // actionLabel - action buttons. Eg: DISMISS
  // onAction - action you want to perform on Clicking on DISMISS
  // backgroundColor - backgroundColor of the toast
  // fontColor - fontColor on the toast
  // onDismiss - optional (we can write this functionality in onAction)
  const {
    visible,
    message,
    actionLabel,
    onAction,
    backgroundColor,
    fontColor,
    onDismiss,
  } = props;

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss ? onDismiss : () => {}}
      action={{
        label: actionLabel,
        onPress: () => {
          onAction();
        },
      }}
      style={{
        top: -(HEIGHT - 100),
        bottom: "auto",
        height:70,
        paddingVertical: 20,
      }}
      duration={1000}
      theme={{
        colors: {
          onSurface: backgroundColor,
          accent: fontColor,
        },
      }}
    >
      {message}
    </Snackbar>
  );
};

export default Toast;
