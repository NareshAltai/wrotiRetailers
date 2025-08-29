import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  mainHeader: {
    backgroundColor: "#fff",
    height: 45,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    width: 40,
    height: 40,
  },
  locationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
    marginVertical: 10,
  },
  locIconTextView: {
    flexDirection: "row",
  },
  locTextView: {
    paddingHorizontal: 10,
  },
  locTextLabel: {
    color: "#2B2520",
    fontSize: 25,
    marginLeft:'39%'
  },
  locText: {
    color: "#84694D",
    fontSize: 14,
  },
  locChangeLinkText: {
    color: "#6AA34A",
  },
  innerContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  searchView: {
    marginBottom: 12,
  },
  search: {
    //border: 'none',
    backgroundColor: "#F0EEEF",
    //opacity: 0.03,
    elevation: 0,
  },
  searchInput: {
    color: "#2B2520",
  },
  menuText: {
    color: "#21272E",
    // opacity: 0.5,
    fontSize: 20,
    marginRight: 40,
    margin:10,
    backgroundColor:'#FFFFFF',
    borderRadius:5
  },
  bannerImageBg: {
    width: "100%",
    height: 250,
  },
  bannerNameDescView: {
    justifyContent: "center",
    height: "100%",
    paddingHorizontal: 22,
  },
  bannerName: {
    color: "#2b2520",
    opacity: 0.7,
    fontSize: 15,
  },
  bannerDesc: {
    color: "#2b2520",
    fontSize: 26,
    width: 180,
  },
  sectionView: {
    marginVertical: 15,
  },
  sectionTitle: {
    color: "#2b2520",
    fontSize: 18,
  },
  sectionSubTitle: {
    color: "#84694D",
    fontSize: 12,
  },
  offerContainer: {
    height: 100,
    width: 100,
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  offerTitle: {
    color: "white",
  },
  offerSubTitle: {
    color: "white",
    textAlign: "center",
  },
  brandContainer: {
    backgroundColor: "#f8f8f8",
    height: 90,
    width: 90,
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  brandLogoImage: {
    width: 40,
    height: 40,
  },

  // First Route Styling

  headingContainer: {
    marginVertical: 10,
  },
  headingTitle: {
    color: "#2B2520",
    fontSize: 20,
    fontFamily: "Lato-Bold",
  },
  headingSubTitle: {
    color: "#84694D",
    fontSize: 14,
    fontFamily: "Lato-Regular",
  },

  cardsContainer: {
    marginVertical: 10,
  },
  button: {
    borderWidth: 1,
    backgroundColor: "#E85A00",
    borderColor: "#E85A00",
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    borderRadius: 6,
    width: 200,
  },
  addText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Lato-Bold",
    marginLeft: 6,
  },
  carbImageStyle: {
    height: 240,
    width: '100%'
  }
});

export default styles;
