import React, { useState, useEffect } from "react";
import { TextInput, View, Button, StyleSheet, StatusBar, TouchableOpacity, Image, Text, ScrollView, Picker } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Divider, Menu } from "react-native-paper";
import DeveloperAPIClient from "../../state/middlewares/DeveloperAPIClient";
import AddImageComponent from '../../components/addImageComponent';
import { useTheme } from "@react-navigation/native";
import Toast from "react-native-simple-toast";

const addOptionScreen = ({ navigation, route }) => {
    const [inputs, setInputs] = useState(['']);
    const [data, setData] = useState([])
    const [screenName, setScreenName] = useState();
    const [optionName, setOptionName] = useState();
    const [sortOrder, setSortOrder] = useState();
    const [optionValueName, setOptionValueName] = useState();
    const [optionValueSortOrder, setOptionValueSortOrder] = useState();
    const [optionValueImage, setOptionValueImage] = useState();
    const [selectedOptionType, setSelectedOptionType] = useState('select');
    const [visibleCats, setVisibleCats] = React.useState(false);
    const theme = useTheme();
    const [onAddNewInput, setOnAddNewInput] = useState([]);

    const handleAddTextInput = () => {
        console.log("test")
        let array = [...data];
        setData([])
        array.push({
            option_value_description: {
                1: {
                    name: ""
                },
                2: {
                    name: ""
                },
                3: {
                    name: ""
                }
            }, sort_order: '', image: 'https://ocuat.wroti.app/image/cache/no_image-100x100.png', option_value_id: ''
        })
        console.log(array)
        setData(array)
        console.log("DATA+++++", JSON.stringify(data))
    };

    const removeInput = () => {
        setData(data.slice(0, -1));
    };

    // .sort()
    const optionTypeData = [
        'select',
        'radio',
        'checkbox',
        'text',
        'textArea',
        'file',
        'date',
        'time',
        'datetime'
    ]

    const updatecat = async (val) => {
        setVisibleCats(false);
        setSelectedOptionType(val);
    };

    const getOptionsDataById = async () => {
        setOptionName(route.params.optionObject.name)
        setSelectedOptionType(route.params.optionObject.type)
        setSortOrder(route.params.optionObject.sort_order)
        let optionId = route.params.optionObject.option_id
        let api = new DeveloperAPIClient();
        let UserMobile = await AsyncStorage.getItem("MobileNumber");
        let Token = await AsyncStorage.getItem("token");
        let addOptionsData = await api.getOptionDetailsByOptionId(UserMobile, Token, optionId);
        if (addOptionsData.data.success == true) {
            console.log("addOptionsData", JSON.stringify(addOptionsData.data.optiondata))
            setData(addOptionsData.data.optiondata)
            // // let array = addOptionsData.data.optiondata
            // // let newArray = [...array]
            // // setData(newArray)
            // // console.log('DATAAAAAA',data)
            // for (let i = 0; i < addOptionsData.data.optiondata.length; i++) {
            //     // setOptionValueName(addOptionsData.data.optiondata[i].option_value_description[1].name)
            //     //setOptionValueSortOrder(addOptionsData.data.optiondata[i].sort_order)

            //     onChangeOptionValueName(i, addOptionsData.data.optiondata[i].option_value_description[1].name)
            // }
        }
    };

    const editOption = async () => {
        if (optionName == "" || optionName == undefined || optionName.length <= 0) {
            Toast.showWithGravity(
                "Option Name Cannot be Empty",
                Toast.LONG,
                Toast.BOTTOM
            );
            return false;
        }
        console.log("INPUTS", onAddNewInput)
        let api = new DeveloperAPIClient();
        let UserMobile = await AsyncStorage.getItem("MobileNumber");
        let Token = await AsyncStorage.getItem("token");
        let optionId = route.params.optionObject.option_id
        let editOptionsData = await api.getEditOption(optionName, selectedOptionType, sortOrder, data, optionId, UserMobile, Token);
        if (editOptionsData.data.success === true) {
            Toast.showWithGravity(
                "Option Updated Successfully",
                Toast.LONG,
                Toast.BOTTOM
            );
            navigation.goBack();
        }
        console.log("addOptionsData", editOptionsData)
    };

    useEffect(() => {
        setTimeout(async () => {
            if (route.params.optionObject != undefined) {
                getOptionsDataById();
            }
        });
    }, [route])

    const onChangeOptionValueName = async (index, val) => {
        console.log("Data==>", JSON.stringify(data[index].option_value_description[1].name))
        // setOptionValueName(val)
        let array = [...data]
        array[index].option_value_description[1].name = val
        let optionName = array[index].option_value_description[1].name
        setOptionValueName(optionName)
    };

    const onChangeOptionValueSortOrder = async (index, val) => {
        let array = [...data]
        console.log("index", index)
        // setOptionValueSortOrder(val)
        array[index].sort_order = val
        let optionSortOrderValue = array[index].sort_order
        setOptionValueSortOrder(optionSortOrderValue)
    };

    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor="#F4F5F7"
                barStyle={theme.dark ? "light-content" : "dark-content"}
            />
            <View
                style={{
                    flexDirection: "row",
                    marginHorizontal: 5,
                    marginVertical: 15,
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        style={{ width: 28, height: 28, resizeMode: "center" }}
                        source={require("../../assets/back3x.png")}
                    />
                </TouchableOpacity>
                <View style={{ marginLeft: 5 }}>
                    <Text
                        style={{
                            color: "#0F0F0F",
                            fontFamily: "Poppins-Bold",
                            fontSize: 16,
                            marginTop: 2,
                        }}
                    >
                        Edit Option Screen
                    </Text>
                </View>

            </View>
            <ScrollView>
                <View style={{ marginTop: 10, flexDirection: 'row' }}>
                    <Text style={{ marginLeft: 12, fontFamily: "Poppins-Regular", fontSize: 12, marginTop: 3, color: '#F00' }}>
                        *
                    </Text>
                    <Text style={{ marginLeft: 6, fontFamily: "Poppins-Medium" }}>
                        Option Name
                    </Text>
                </View>
                <Text
                    
                />
                <View style={{ marginTop: 10 }}>
                    <Text style={{ marginLeft: 12, fontFamily: "Poppins-Medium" }}>
                        Type
                    </Text>
                </View>
                <View
                    style={{
                        height: 40,
                        margin: 12,
                        padding: 5,
                        backgroundColor: "#F7F7FC",
                    }}
                >
                    <Menu
                        visible={visibleCats}
                        onDismiss={() => setVisibleCats(!visibleCats)}
                        anchor={
                            <TouchableOpacity
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginHorizontal: 10,

                                }}
                                activeOpacity={0.7}
                                onPress={() => setVisibleCats(!visibleCats)}
                            >
                                <Text style={{ marginTop: 3 }} numberOfLines={1}>{selectedOptionType}</Text>
                                {/* <Text style={{ color: "#2F6E8F" }}>+ ADD</Text> */}
                            </TouchableOpacity>
                        }
                    >
                        {optionTypeData &&
                            optionTypeData.map((val, i) => {
                                return (
                                    <Menu.Item
                                        key={i}
                                        title={val}
                                        onPress={() => updatecat(val)}
                                    />
                                );
                            })}
                    </Menu>
                </View>

                <View style={{ marginTop: 10 }}>
                    <Text style={{ marginLeft: 12, fontFamily: "Poppins-Medium" }}>
                        Sort Order
                    </Text>
                </View>
                <TextInput
                    style={{
                        height: 40,
                        margin: 12,
                        padding: 10,
                        backgroundColor: "#F7F7FC",
                        fontFamily: "Poppins-Regular",
                    }}
                    onChangeText={(val) => setSortOrder(val)}
                    value={sortOrder}
                    keyboardType='number-pad'
                    placeholder="Sort Order"
                    maxLength={5}
                />

                <View>

                    {(selectedOptionType === 'checkbox') || (selectedOptionType === 'select') || (selectedOptionType === 'radio') ? (
                        <ScrollView>
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ marginLeft: 12, fontFamily: "Poppins-Medium", fontSize: 15 }}>
                                    Option Values
                                </Text>
                            </View>

                            {data.length > 0 && data.map((input, index,item) => (
                                console.log("item",JSON.stringify(item))
                            ))}

                            <TouchableOpacity
                                style={{
                                    marginTop: 10,
                                    width: "94%",
                                    height: 45,
                                    paddingTop: 11,
                                    paddingBottom: 15,
                                    backgroundColor: "#5EB169",
                                    marginBottom: "5%",
                                    marginLeft: 10,
                                }}
                                onPress={() => handleAddTextInput()}
                            >
                                <Text
                                    style={{
                                        color: "#fff",
                                        textAlign: "center",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        fontSize: 16,
                                    }}
                                >
                                    Add New Option Value
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    ) : (<></>)}
                </View>
                <TouchableOpacity
                    style={{
                        marginTop: 10,
                        width: "100%",
                        height: 45,
                        paddingTop: 11,
                        paddingBottom: 15,
                        backgroundColor: "#51AF5E",
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: "#fff",
                    }}
                    onPress={() => editOption()}
                >
                    <Text
                        style={{
                            color: "#fff",
                            textAlign: "center",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: 16,
                        }}
                    >
                        Update
                    </Text>
                </TouchableOpacity>
            </ScrollView >
        </View >
    );
};

const styles = StyleSheet.create({
    baseText: {
        fontFamily: "Cochin"
    },
    container: {
        flex: 1,
    },
    titleText: {
        fontSize: 20,
        fontWeight: "bold"
    },
    input: {
        height: 40,
        margin: 12,
        padding: 10,
        backgroundColor: "#F7F7FC",
    },
});

export default addOptionScreen;