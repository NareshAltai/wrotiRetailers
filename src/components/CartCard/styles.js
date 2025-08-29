import { StyleSheet, Dimensions } from "react-native";

const DEVICE_WIDTH = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    width: (DEVICE_WIDTH * 3) / 5,
    height: 240,
    marginVertical: 10,
    marginLeft: 8,
    marginRight: 20,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 8, // Shadow only works on IOS
    elevation: 5, // Elevation works in Android
    borderRadius: 8,
    backgroundColor: "white",
  },
  favIconView: {
    alignItems: "flex-end",
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  productImgView: {
    alignItems: "center",
  },
  productImage: {
    width: 100,
    height: 100,
  },
  namePriceView: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameTitle: {
    color: "#2b2520",
    fontSize: 16,
    fontWeight: "bold",
  },
  nameCompany: {
    color: "#84694D",
    fontSize: 13,
  },
  priceView: {
    justifyContent: "center",
    alignItems: "center",
  },
  priceText: {
    color: "#2b2520",
    fontWeight: "900",
  },
  addToCartBtnView: {
    marginHorizontal: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#E85A00",
    height: 25,
    borderRadius: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  addToCartBtnText: {
    color: "#E85A00",
    paddingLeft: 5,
  },
  
});

export default styles;
