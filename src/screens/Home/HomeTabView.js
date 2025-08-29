import React from "react";
import {
  View,
  Text,
  Dimensions,
  FlatList,
  ImageBackground,
  Image,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";

import styles from "./Styles";
import NewProductCard from "../../components/NewProductCard/NewProductCard";

const HomeTabView = (props) => {
  const {
    banners,
    imageBaseUrl,
    cards,
    popularBrands,
    carbInfo,
    trendingProductsInfo,
    newProductsInfo,
    quickBuysInfo,
  } = props;

  let carbImageUrl = carbInfo.folderPath + carbInfo.contentUrl;
  const carbInfoImageUrl = imageBaseUrl + carbImageUrl;

  const [carouselIndex, setCarouselIndex] = React.useState(0);

  const _renderCarouselItem = (banner) => {
    let item = banner.item;
    let imageUrl = item.folderPath + item.contentUrl;
    const fullImageUrl = imageBaseUrl + imageUrl;
    let bannerDescription = item.bannerDescription;
    bannerDescription = bannerDescription.replace("<p>", "");
    bannerDescription = bannerDescription.replace("</p>", "");
    return (
      <ImageBackground
        source={{ uri: fullImageUrl }}
        style={styles.bannerImageBg}
      >
        <View style={styles.bannerNameDescView}>
          <Text style={styles.bannerName}>{item.name}</Text>
          <Text style={styles.bannerDesc}>{bannerDescription}</Text>
        </View>
      </ImageBackground>
    );
  };

  const renderOffers = (item) => {
    return (
      <View style={[{ backgroundColor: item.color }, styles.offerContainer]}>
        <Text style={styles.offerTitle}>{item.title}</Text>
        <Text style={styles.offerSubTitle}>{item.tag}</Text>
      </View>
    );
  };

  const renderBrands = (item) => {
    let imageUrl = item.folderPath + item.contentUrl;
    const fullImageUrl = imageBaseUrl + imageUrl;
    return (
      <View style={styles.brandContainer}>
        <Image class={styles.brandLogoImage} source={{ uri: fullImageUrl }} />
      </View>
    );
  };

  const renderTrendingProducts = (item) => {
    return (
      <NewProductCard
        title={item.title}
        tag={item.brand.brandName}
        price={item.mrp}
        tagImage1={require("../../assets/HydroponicBig.png")}
      />
    );
  };

  const renderQuickBuy = (item) => {
    return (
      <NewProductCard
        title={item.title}
        tag={item.brand.brandName}
        price={item.mrp}
        tagImage1={require("../../assets/HydroponicBig.png")}
      />
    );
  };

  return (
    <View>
      <View>
        <Carousel
          layout={"default"}
          //ref={ref => this.carousel = ref}
          data={banners}
          sliderWidth={Dimensions.get("window").width}
          itemWidth={Dimensions.get("window").width}
          renderItem={_renderCarouselItem}
          onSnapToItem={(index) => setCarouselIndex(index)}
        />
        <Pagination
          dotsLength={banners.length}
          activeDotIndex={carouselIndex}
          dotColor={"#E85A00"}
          inactiveDotColor={"#fa8072"}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          dotStyle={{ width: 8, height: 8, borderRadius: 4 }}
          containerStyle={{ paddingVertical: 12 }}
        />
      </View>
      <View style={styles.sectionView}>
        <View>
          <Text style={styles.sectionTitle}>Ongoing Offers</Text>
          <Text style={styles.sectionSubTitle}>
            Our Current line of great offers
          </Text>
        </View>
        <FlatList
          style={{ marginTop: 10 }}
          data={cards}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => renderOffers(item)}
        />
      </View>
      <View style={styles.sectionView}>
        <View>
          <Text style={styles.sectionTitle}>Popular Brands</Text>
          <Text style={styles.sectionSubTitle}>
            Brands that are trending right now!
          </Text>
        </View>
        <FlatList
          style={{ marginTop: 10 }}
          data={popularBrands}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => renderBrands(item)}
        />
      </View>
      <View style={{ width: "100%", marginVertical: 20, height: 240 }}>
        <Image
          source={{ uri: carbInfoImageUrl }}
          style={styles.carbImageStyle}
          resizeMode={"cover"}
        />
      </View>
      <View style={styles.sectionView}>
        <View>
          <Text style={styles.sectionTitle}>{trendingProductsInfo.title}</Text>
          <Text style={styles.sectionSubTitle}>{trendingProductsInfo.tag}</Text>
        </View>
        <FlatList
          style={{ marginTop: 10 }}
          data={trendingProductsInfo.data}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => renderTrendingProducts(item)}
        />
      </View>
      <View style={styles.sectionView}>
        <View>
          <Text style={styles.sectionTitle}>{quickBuysInfo.title}</Text>
          <Text style={styles.sectionSubTitle}>{quickBuysInfo.tag}</Text>
        </View>
        <FlatList
          style={{ marginTop: 10 }}
          data={quickBuysInfo.data}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => renderQuickBuy(item)}
        />
      </View>
    </View>
  );
};

export default HomeTabView;
