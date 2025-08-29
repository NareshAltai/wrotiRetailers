import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Dimensions,
  ScrollView,
} from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").width;
import Swiper from "react-native-swiper";
import StarRating from "react-native-star-rating";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import SizeButton from "../../components/SizeButton";
import Accordian from "../../components/Accordian";
import ReviewCard from "../../components/ReviewCard";
import ProductDetailCard from "../../components/ProductDetailCard";

import RecipesCard from "../../components/RecipesCard";
export default class ProductDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      starCount: 4,
    };
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="black" barStyle="light-content" />

        {/* Header  */}
        <View style={{ height: 360 }}>
          <Swiper
            loop={false}
            dot={<View style={styles.dot} />}
            activeDot={<View style={styles.activedot} />}
          >
            <ImageBackground
              style={{ width: width, height: height - 50 }}
              source={require("../../assets/kiwi-kumquat-ginger-1-960x540.png")}
            >
              <ImageBackground
                style={{ width: width, height: height - 50 }}
                source={require("../../assets/Overlay.png")}
              >
                <View style={styles.header}>
                  <EvilIcons
                    onPress={() => alert("")}
                    name="arrow-left"
                    size={25}
                    color="white"
                  />
                  <View style={{ flexDirection: "row" }}>
                    <EvilIcons
                      onPress={() => alert("")}
                      name="share-apple"
                      size={25}
                      color="white"
                      style={{ marginLeft: 10 }}
                    />
                    <EvilIcons
                      onPress={() => alert("")}
                      name="heart"
                      size={25}
                      color="white"
                      style={{ marginLeft: 10 }}
                    />
                  </View>
                </View>
              </ImageBackground>
            </ImageBackground>
            <ImageBackground
              style={{ width: width, height: height - 50 }}
              source={require("../../assets/AdobeStock_237290530_Preview.png")}
            >
              <ImageBackground
                style={{ width: width, height: height - 50 }}
                source={require("../../assets/Overlay.png")}
              >
                <View style={styles.header}>
                  <EvilIcons
                    onPress={() => alert("")}
                    name="arrow-left"
                    size={25}
                    color="white"
                  />
                  <View style={{ flexDirection: "row" }}>
                    <EvilIcons
                      onPress={() => alert("")}
                      name="share-apple"
                      size={25}
                      color="white"
                      style={{ marginLeft: 10 }}
                    />
                    <EvilIcons
                      onPress={() => alert("")}
                      name="heart"
                      size={25}
                      color="white"
                      style={{ marginLeft: 10 }}
                    />
                  </View>
                </View>
              </ImageBackground>
            </ImageBackground>
          </Swiper>
        </View>
        {/* Body */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.body}>
            {/* Details */}
            <View style={styles.detailsContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <StarRating
                    disabled={true}
                    maxStars={5}
                    emptyStarColor="#EAECF0"
                    fullStarColor="#F8CA0D"
                    starSize={20}
                    starStyle={{ marginLeft: 2 }}
                    containerStyle={{
                      width: 50,
                    }}
                    rating={this.state.starCount}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Image
                    style={{ resizeMode: "stretch", marginLeft: 4 }}
                    source={require("../../assets/OffersBig.png")}
                  />
                  <Image
                    style={{ resizeMode: "stretch", marginLeft: 4 }}
                    source={require("../../assets/OrganicBig-1.png")}
                  />
                  <Image
                    style={{ resizeMode: "stretch", marginLeft: 4 }}
                    source={require("../../assets/HydroponicBig.png")}
                  />
                </View>
              </View>
              <View style={{ marginTop: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <View>
                    <Text style={styles.heading}>Kiwi</Text>
                    <Text
                      style={[
                        styles.heading,
                        {
                          color: "#84694D",
                          fontSize: 15,
                          fontFamily: "Lato-Regular",
                          marginTop: 2,
                        },
                      ]}
                    >
                      Safe, Preservation Free
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.heading,
                      {
                        marginTop: 2,
                      },
                    ]}
                  >
                    ₹180
                  </Text>
                </View>
                <Text
                  style={[
                    styles.heading,
                    {
                      fontFamily: "Lato-Regular",
                      fontSize: 14,
                      textAlign: "justify",
                      marginTop: 5,
                    },
                  ]}
                >
                  Kiwis are oval shaped with a brownish outer skin. The flesh is
                  bright green and juicy with tiny, edible black seeds. With its
                  distinct sweet-sour taste and a pleasant smell, it tastes like
                  strawberry and honeydew melon.
                </Text>
              </View>
              <Text
                style={[styles.heading, { color: "#A8A4A7", fontSize: 15 }]}
              >
                SELECT SIZE
              </Text>
              <View style={styles.sizeContainer}>
                <SizeButton active={true} number="500 Kg" />
                <SizeButton number="500 Kg" />
                <SizeButton number="500 Kg" />
              </View>

              <Text
                style={[styles.heading, { color: "#A8A4A7", fontSize: 15 }]}
              >
                More information
              </Text>
            </View>
            <Accordian title="About the product">
              <Text
                style={[
                  styles.heading,
                  {
                    fontFamily: "Lato-Regular",
                    fontSize: 14,
                    textAlign: "justify",
                    marginTop: 5,
                  },
                ]}
              >
                Kiwis are oval shaped with a brownish outer skin. The flesh is
                bright green and juicy with tiny, edible black seeds. With its
                distinct sweet-sour taste and a pleasant smell, it tastes like
                strawberry and honeydew melon.
              </Text>

              <View>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    style={{ resizeMode: "stretch" }}
                    source={require("../../assets/OrganicBig-1.png")}
                  />
                  <Text
                    style={[
                      styles.heading,
                      {
                        fontFamily: "Lato-Regular",
                        fontSize: 14,
                        textAlign: "justify",
                        marginLeft: 10,
                      },
                    ]}
                  >
                    Hydroponic
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    style={{ resizeMode: "stretch" }}
                    source={require("../../assets/OffersBig.png")}
                  />
                  <Text
                    style={[
                      styles.heading,
                      {
                        fontFamily: "Lato-Regular",
                        fontSize: 14,
                        textAlign: "justify",
                        marginLeft: 10,
                      },
                    ]}
                  >
                    Organic
                  </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    style={{ resizeMode: "stretch" }}
                    source={require("../../assets/HydroponicBig.png")}
                  />
                  <Text
                    style={[
                      styles.heading,
                      {
                        fontFamily: "Lato-Regular",
                        fontSize: 14,
                        textAlign: "justify",
                        marginLeft: 10,
                      },
                    ]}
                  >
                    Offer
                  </Text>
                </View>
              </View>
            </Accordian>

            <Accordian title="Storage and Uses" />
            <Accordian title="Benefits" />
            <Accordian title="Other Product Info" />

            <Text style={[styles.heading, { color: "#A8A4A7", fontSize: 15 }]}>
              Reviews
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <ReviewCard />
              <ReviewCard />
            </ScrollView>

            <TouchableOpacity style={styles.reviewButton}>
              <Text
                style={[
                  styles.heading,
                  {
                    color: "#2B2520",
                    textAlign: "center",
                    fontSize: 14,
                  },
                ]}
              >
                Read all reviews
              </Text>
            </TouchableOpacity>

            <View style={{ marginVertical: 10 }}>
              <Text style={[styles.heading, { marginVertical: 10 }]}>
                Frequently bought together
              </Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <ProductDetailCard />
                <ProductDetailCard />
                <ProductDetailCard />
              </ScrollView>
            </View>
            <View style={{ marginVertical: 10 }}>
              <Text
                style={[styles.heading, { marginVertical: 10, fontSize: 18 }]}
              >
                Recipes curated with this product
              </Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <RecipesCard />
                <RecipesCard />
                <RecipesCard />
              </ScrollView>
            </View>
            <View style={{ marginVertical: 10 }}>
              <Text style={[styles.heading, { marginVertical: 10 }]}>
                MORE FROM THIS CATEGORY
              </Text>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <ProductDetailCard />
                <ProductDetailCard />
                <ProductDetailCard />
              </ScrollView>
            </View>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={[styles.button, { backgroundColor: "#E85A00" }]}
            >
              <Text
                style={{
                  fontFamily: "Lato-Bold",
                  color: "white",
                  textAlign: "center",
                }}
              >
                BUY NOW
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              style={[
                styles.button,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#E85A00",
                  justifyContent: "center",
                },
              ]}
            >
              <EvilIcons name="plus" size={25} color="#E85A00" />
              <Text
                style={{
                  fontFamily: "Lato-Bold",
                  fontSize: 14,
                  color: "#E85A00",
                  marginLeft: 5,
                }}
              >
                Add to cart
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FADECC",
    marginHorizontal: 2,
  },
  activedot: {
    backgroundColor: "#E85A00",
    width: 20,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  body: {
    marginHorizontal: 15,
  },
  heading: {
    color: "#2B2520",
    fontFamily: "Lato-Bold",
    fontSize: 22,
  },
  sizeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  reviewButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#2B2520",
    borderRadius: 5,
    marginVertical: 10,
  },
  footer: {
    backgroundColor: "white",
    elevation: 4,
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    width: "48%",
    margin: 10,
  },
});
