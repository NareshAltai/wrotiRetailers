import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { TabRouter, useTheme } from "@react-navigation/native";
import { Divider, Menu } from "react-native-paper";
import DeveloperAPIClient from "../../state/middlewares/DeveloperAPIClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decode } from "html-entities";
import { Icon, Input } from "react-native-elements";
import Toast from "react-native-simple-toast";
import DocumentPicker from "react-native-document-picker";
import { write } from "react-native-fs";
import { parse } from "qs";

const EditTemplateScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const { colors } = useTheme();
  const [loader, setLoader] = React.useState(false);
  const [visibleCats, setVisibleCats] = React.useState(false);
  const [visibleLanguages, setVisibleLanguages] = React.useState(false);
  const [visibleHeader, setVisibleHeader] = React.useState(false);
  const [visibleHeaderMedia, setVisibleHeaderMedia] = React.useState(false);
  const [visibleHeaderVariable, setVisibleHeaderVariable] = React.useState(
    false
  );
  const [visibleBodyVariable, setVisibleBodyVariable] = React.useState(false);
  const [
    visibleHeaderChildVariable,
    setVisibleHeaderChildVariable,
  ] = React.useState(false);
  const [visibleButtons, setVisibleButtons] = React.useState(false);
  const [
    visibleCallToActionButtons,
    setVisibleCallToActionButtons,
  ] = React.useState(false);
  const [visibleSelectedType, setVisibleSelectedType] = React.useState(false);
  const [templateName, setTemplateName] = React.useState();
  const [mediaTextName, setMediaTextName] = React.useState();
  const [languages, setlanguages] = React.useState();
  const [selectedLanguage, setSelectedLanguage] = React.useState();
  const [cats, setCats] = React.useState("TRANSACTIONAL");
  const [callToActionButtonName, setCallToActionButtonName] = React.useState(
    []
  );
  const [bodyVariableCount, setBodyVariableCount] = React.useState();
  const [viewWebsiteSelectType, setViewWebsiteSelectType] = React.useState(
    "Static"
  );
  const [selectedMediaType, setSelectedMediaType] = React.useState();
  const [selectedMedia, setSelectedMedia] = React.useState("Image");
  const [selectedParentVariable, setSelectedParentVariable] = React.useState();
  const [selectedButtonVariable, setSelectedButtonVariable] = React.useState();
  const [
    visibleButtonVariableData,
    setVisibleButtonVariableData,
  ] = React.useState(false);
  const [selectedChildVariable, setSelectedChildVariable] = React.useState();
  const [bodyText, setBodyText] = useState();
  const [phoneButtonText, setPhoneButtonText] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [urlText, setUrlText] = useState();
  const [selectedButtonType, setSelectButtonType] = useState();
  const [data, setData] = useState([]);
  const [image, setImage] = useState();
  const [footerText, setFooterText] = useState();
  const [visitWebSiteButtonText, setVisitWebSiteButtonText] = React.useState();

  const [
    mediaPlaceHolderSelected,
    setMediaPlaceHolderSelected,
  ] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [variableCount, setVariableCount] = React.useState("1");
  const [buttonVariableCount, setButtonVariableCount] = React.useState("1");
  const [variable, setVariable] = React.useState(false);
  const [buttonVariable, setButtonVariable] = React.useState(false);
  const [variableData, setVariableData] = React.useState();
  const [marketingOPTActive, setMarketingOPTActive] = React.useState(false);
  const [bodyVariableData, setBodyVariableData] = React.useState([]);
  const [selectedBodyVariable, setSelectedBodyVariable] = React.useState([]);

  const getSupportedLanguages = async () => {
    const api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem("MobileNumber");
    let allSupportedLanguagesdata = await api.getSupportedLanguages(UserMobile);
    setlanguages(allSupportedLanguagesdata.data.Languages);
  };

  const handleAddTextInput = (val) => {
    if (data.length >= 3) {
      return false;
    }
    // onAddMarketingOpt();
    let array = [...data];
    setData([]);
    array.push({
      type: "QUICK_REPLY",
      text: "",
    });
    setData(array);
    if (marketingOPTActive) {
      if (parseInt(data?.length) == 0) {
        setData((prev) => {
          let obj = [...prev];
          obj[0].text = "Stop Promotions";
          return obj;
        });
      }
      if (parseInt(data?.length) == 1) {
        setData((prev) => {
          let obj = [...prev];
          obj[0].text = "";
          obj[1].text = "Stop Promotions";
          return obj;
        });
      }
      if (parseInt(data?.length) == 2) {
        setData((prev) => {
          let obj = [...prev];
          obj[0].text = "";
          obj[1].text = "";
          obj[2].text = "Stop Promotions";
          return obj;
        });
      }
    }
  };

  const onAddMarketingOpt = () => {
    setMarketingOPTActive(true);
    if (parseInt(data?.length) == 1) {
      setData((prev) => {
        let obj = [...prev];
        obj[0].text = "Stop Promotions";
        return obj;
      });
    }
    if (parseInt(data?.length) == 2) {
      setData((prev) => {
        let obj = [...prev];
        obj[1].text = "Stop Promotions";
        return obj;
      });
    }
    if (parseInt(data?.length) == 3) {
      setData((prev) => {
        let obj = [...prev];
        obj[2].text = "Stop Promotions";
        return obj;
      });
    }
  };

  const handleAddBodyVariable = () => {
    if (bodyText != undefined) {
      if (bodyVariableData?.length != 0) {
        setBodyText(
          bodyText + " " + `{{${JSON.parse(bodyVariableData?.length + 1)}}}`
        );
      } else {
        setBodyText(bodyText + " " + `{{${JSON.parse(1)}}}`);
      }
    } else {
      setBodyText(`{{${bodyVariableData?.length + 1}}}`);
    }
    let array = [...bodyVariableData];
    setBodyVariableData([]);
    array.push({
      body_text: [
        {
          isModal: false,
          selectedValue: undefined,
          selectedValueKey: undefined,
        },
      ],
    });
    setBodyVariableData(array);
  };

  const categoryType = [
    { name: "TRANSACTIONAL", id: 1 },
    { name: "MARKETING", id: 2 },
  ];

  const callToActionButtonList = [
    { name: "Call Phone", id: 1 },
    { name: "Visit Website", id: 2 },
  ];

  const HeadersList = [
    { name: "None", id: 3 },
    { name: "Text", id: 1 },
    { name: "Media", id: 2 },
  ];

  const HeadersMediaList = [
    { name: "Image", id: 3 },
    { name: "Document", id: 1 },
    { name: "Video", id: 2 },
  ];

  const ButtonsList = [
    { name: "None", id: 3 },
    { name: "Call to action", id: 1 },
    { name: "Quick Reply", id: 2 },
  ];

  const viewWebsiteTypes = [
    { name: "Static", id: 3 },
    { name: "Dynamic", id: 1 },
  ];

  const placeholderValue = 0;

  const populateButtons = async (item) => {
    let api = new DeveloperAPIClient();
    let Token = await AsyncStorage.getItem("token");
    let variableDataResponse = await api.getVariableData(Token);
    let localArray = [];
    localArray.push(item);
    for (let s = 0; s < localArray.length; s++) {
      if (localArray[s].type == "QUICK_REPLY") {
        setSelectButtonType("Quick Reply");
        for (let i = 0; i < route?.params?.template?.components.length; i++) {
 
          if (route?.params?.template?.components[i].type == "BUTTONS") {
      
            setData(route?.params?.template?.components[i].buttons);
          }
        }
      }
      if (localArray[s].type.includes("PHONE_NUMBER")) {
        setSelectButtonType("Call to action");
        // callToActionButtonName
        setPhoneButtonText(localArray[s].text);
        setPhoneNumber(localArray[s].phone_number);
      }
      if (localArray[s].type.includes("URL")) {
        setSelectButtonType("Call to action");
        if (localArray[s].url.includes("{{1}}")) {
          setButtonVariable(true);
          setViewWebsiteSelectType("Dynamic");
        }
        for (let j = 0; j < variableDataResponse?.data?.length; j++) {
          if (
            variableDataResponse.data[j]?.key === localArray[s]?.example[0][0]
          ) {
            setSelectedButtonVariable(variableDataResponse?.data[j]);
          }
        }
        setVisitWebSiteButtonText(localArray[s].text);
        setUrlText(localArray[s].url);
      }
    }
  };

  const getVariableData = async () => {
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem("MobileNumber");
    let Token = await AsyncStorage.getItem("token");
    let variableDataResponse = await api.getVariableData(Token);
    setVariableData(variableDataResponse.data);
    if (route) {
      for (let i = 0; i < route?.params?.template?.components?.length; i++) {
        if (route?.params?.template?.components[i]?.type == "HEADER") {
          setSelectedMediaType(route?.params?.template?.components[i]?.format);
          setMediaTextName(route?.params?.template?.components[i]?.text);
          if (route.params.template.components[i]?.text.includes("{{1}}")) {
            setVariable(true);
            for (let j = 0; j < variableDataResponse.data?.length; j++) {
              if (
                variableDataResponse.data[j].key ===
                route?.params?.template?.components[i]?.example
                  ?.media_text[0][0]
              ) {
                setSelectedParentVariable(variableDataResponse?.data[i]);
              }
            }
          }
        }
        if (route?.params?.template?.components[i]?.type == "BODY") {
          setBodyVariableData(
            route?.params?.template?.components[i].example.body_text[0]
          );
          for (let s = 0; s < variableDataResponse.data?.length; s++) {
            console.log("hey")
            if (
              variableDataResponse.data[s].key ===
              route?.params?.template?.components[i].example.body_text[0]
            ) {
              console.log("Hello", variableDataResponse?.data[i]);
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    getSupportedLanguages();
    getVariableData();
    if (route) {
      console.log("HeyRoute", JSON.stringify(route?.params?.template));
      setTemplateName(route?.params?.template?.name);
      if (route?.params?.template?.language == "en_US") {
        setSelectedLanguage("English");
      }
      setCats(route?.params?.template?.category);
      for (let i = 0; i < route?.params?.template?.components.length; i++) {
        if (route?.params?.template?.components[i].type == "BODY") {
          setBodyText(route?.params?.template?.components[i].text);
        }
        if (route?.params?.template?.components[i].type == "FOOTER") {
          setFooterText(route?.params?.template?.components[i].text);
        }
        if (route?.params?.template?.components[i].type == "BUTTONS") {
          if (
            parseInt(route?.params?.template?.components[i].buttons.length) ===
            2
          ) {
            let array = [
              { id: 1, name: "Call Phone" },
              { id: 2, name: "Visit Website" },
            ];
            setCallToActionButtonName(array);
          }
          if (
            parseInt(route?.params?.template?.components[i].buttons.length) ===
            1
          ) {
            if (
              route?.params?.template?.components[i].buttons[0].type ==
              "PHONE_NUMBER"
            ) {
              let array = [{ id: 1, name: "Call Phone" }];
              setCallToActionButtonName(array);
            }
            if (
              route?.params?.template?.components[i].buttons[0].type == "URL"
            ) {
              let array = [{ id: 2, name: "Visit Website" }];
              setCallToActionButtonName(array);
            }
          }
          {
            route?.params?.template?.components[i].buttons &&
              route?.params?.template?.components[i].buttons.map((val, i) => {
                return populateButtons(val);
              });
          }
        }
      }
    }
  }, []);

  const updatecat = async (val) => {
    setVisibleCats(false);
    setCats(val.name);
  };

  const updateCallToActionButton = async (val) => {
    setVisibleCallToActionButtons(false);
    const result = callToActionButtonName.filter(
      (option) => option.id == val.id
    );
    if (result.length == 0) {
      let localItem = [...callToActionButtonName];
      localItem.push(val);
      setCallToActionButtonName(localItem);
    } else {
      Toast.showWithGravity(
        "Button Type Already Exists",
        Toast.LONG,
        Toast.BOTTOM
      );
    }
  };

  const updateTemplate = async () => {
    if (data.length > 0) {
      setPhoneButtonText();
      setVisitWebSiteButtonText();
    }
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem("MobileNumber");
    let Token = await AsyncStorage.getItem("token");
    let categoryName = "";
    if (cats != undefined) {
      categoryName = cats;
    }
    let language = "";
    if (
      templateName == null ||
      templateName.length == 0 ||
      templateName.trim() == ""
    ) {
      Toast.showWithGravity(
        "Please enter template name",
        Toast.LONG,
        Toast.BOTTOM
      );
      return false;
    }

    if (cats == undefined) {
      Toast.showWithGravity(
        "Please Select Category Type",
        Toast.LONG,
        Toast.BOTTOM
      );
      return false;
    }

    if (
      !isNaN(templateName[0]) ||
      !/^[a-zA-Z][a-zA-Z0-9\s]*$/.test(templateName[0]) ||
      templateName[0] === "-" ||
      templateName[0] === "@" ||
      templateName[0] === "."
    ) {
      Toast.showWithGravity(
        "Template name should starts with alphabets.",
        Toast.LONG,
        Toast.BOTTOM
      );
      return false;
    }
    if (selectedMediaType == "Text") {
      if (
        mediaTextName == null ||
        mediaTextName == undefined ||
        mediaTextName[0] == "" ||
        mediaTextName == "" ||
        mediaTextName?.length <= 0
      ) {
        Toast.showWithGravity(
          "Please enter header text.",
          Toast.LONG,
          Toast.BOTTOM
        );
        return false;
      }
    }
    if (selectedButtonType == "Call to action") {
      if (callToActionButtonName && callToActionButtonName?.length <= 0) {
        Toast.showWithGravity(
          "Call to action is required any one type of button to create template.",
          Toast.LONG,
          Toast.BOTTOM
        );
        return false;
      }
    }
    for (let i = 0; i < callToActionButtonName.length; i++) {
      if (callToActionButtonName[i]?.name == "Call Phone") {
        if (
          phoneButtonText == null ||
          phoneButtonText == undefined ||
          phoneButtonText[0] == "" ||
          phoneButtonText == "" ||
          phoneButtonText?.length <= 0
        ) {
          Toast.showWithGravity(
            "Please enter phone button text",
            Toast.LONG,
            Toast.BOTTOM
          );
          return false;
        }
        if (
          phoneNumber == null ||
          phoneNumber == undefined ||
          phoneNumber[0] == "" ||
          phoneNumber == "" ||
          phoneNumber?.length <= 0
        ) {
          Toast.showWithGravity(
            "Please enter phone number",
            Toast.LONG,
            Toast.BOTTOM
          );
          return false;
        }
      }
      if (callToActionButtonName[i]?.name == "Visit Website") {
        if (
          visitWebSiteButtonText == null ||
          visitWebSiteButtonText == undefined ||
          visitWebSiteButtonText[0] == "" ||
          visitWebSiteButtonText == "" ||
          visitWebSiteButtonText?.length <= 0
        ) {
          Toast.showWithGravity(
            "Please enter website button text",
            Toast.LONG,
            Toast.BOTTOM
          );
          return false;
        }
        if (
          urlText == null ||
          urlText == undefined ||
          urlText[0] == "" ||
          urlText == "" ||
          urlText?.length <= 0
        ) {
          Toast.showWithGravity(
            "Please enter valid url",
            Toast.LONG,
            Toast.BOTTOM
          );
          return false;
        }
      }
    }
    if (selectedLanguage == undefined) {
      Toast.showWithGravity("Please Select Language", Toast.LONG, Toast.BOTTOM);
      return false;
    }
    if (bodyText == null || bodyText.length == 0 || bodyText.trim() == "") {
      Toast.showWithGravity(
        "Body is mandatory field",
        Toast.LONG,
        Toast.BOTTOM
      );
      return false;
    }
    if (selectedLanguage == "English") {
      language = "en_US";
    }
    if (selectedLanguage == "Telugu") {
      language = "te";
    }
    if (selectedLanguage == "عربي") {
      language = "ar";
    }
    if (selectedButtonType == "Quick Reply") {
      if (data && data.length <= 0) {
        Toast.showWithGravity(
          "Atleast on button is mandatory",
          Toast.LONG,
          Toast.BOTTOM
        );
        return false;
      }
    }
    if (selectedButtonType == "Call to action") {
      if (callToActionButtonName && callToActionButtonName.length <= 0) {
        Toast.showWithGravity(
          "Atleast on button is mandatory",
          Toast.LONG,
          Toast.BOTTOM
        );
        return false;
      }
    }

    for (let i = 0; i < callToActionButtonName.length; i++) {
      if (callToActionButtonName[i].name == "Call Phone") {
        if (phoneButtonText?.length <= 0) {
          Toast.showWithGravity(
            "Please add button text for phone",
            Toast.LONG,
            Toast.BOTTOM
          );
          return false;
        }
        if (phoneNumber?.length <= 0) {
          Toast.showWithGravity(
            "Phone number cannot be empty",
            Toast.LONG,
            Toast.BOTTOM
          );
          return false;
        }
      }
      if (callToActionButtonName[i].name == "Visit Website") {
        if (visitWebSiteButtonText?.length <= 0) {
          Toast.showWithGravity(
            "Please add button text for website",
            Toast.LONG,
            Toast.BOTTOM
          );
          return false;
        }
        if (urlText?.length <= 0) {
          Toast.showWithGravity("Please enter url", Toast.LONG, Toast.BOTTOM);
          return false;
        }
      }
    }
    let component = [];
    if (footerText?.length > 0) {
      component.push({
        type: "FOOTER",
        text: footerText,
      });
    }
    if (bodyText.length > 0) {
      component.push({
        type: "BODY",
        text: bodyText.trim(),
        example: {
          body_text: [[bodyText.trim()]],
        },
      });
    }
    if (mediaTextName?.length > 0) {
      component.push({
        type: "HEADER",
        format: selectedMediaType,
        text: mediaTextName.trim(),
        example: {
          media_text: [
            [
              selectedParentVariable
                ? selectedParentVariable.key
                : mediaTextName.trim(),
            ],
          ],
        },
      });
    }
    if (image != undefined) {
      component.push({
        type: "header",
        parameters: [
          {
            type: selectedMediaType,
            image: {
              link: image.url,
            },
          },
        ],
      });
    }
    if (data?.length > 0) {
      component.push({
        type: "BUTTONS",
        buttons: data,
      });
    }
    if (
      phoneButtonText?.length > 0 &&
      (visitWebSiteButtonText?.length <= 0 ||
        visitWebSiteButtonText?.length == undefined)
    ) {
      component.push({
        type: "BUTTONS",
        buttons: [
          {
            type: "PHONE_NUMBER",
            text: phoneButtonText,
            phone_number: phoneNumber,
          },
        ],
      });
    }
    if (
      (phoneButtonText?.length <= 0 || phoneButtonText?.length == undefined) &&
      visitWebSiteButtonText?.length > 0
    ) {
      component.push({
        type: "BUTTONS",
        buttons: [
          {
            type: "URL",
            text: visitWebSiteButtonText,
            url: urlText,
            example: [
              [
                viewWebsiteSelectType == "Dynamic"
                  ? selectedButtonVariable.key
                  : urlText,
              ],
            ],
          },
        ],
      });
    }
    if (phoneButtonText?.length > 0 && visitWebSiteButtonText?.length > 0) {
     component.push({
        type: "BUTTONS",
        buttons: [
          {
            type: "PHONE_NUMBER",
            text: phoneButtonText,
            phone_number: phoneNumber,
          },
          {
            type: "URL",
            text: visitWebSiteButtonText,
            url: urlText,
            example: [
              [
                viewWebsiteSelectType == "Dynamic"
                  ? selectedButtonVariable.key
                  : urlText,
              ],
            ],
          },
        ],
      });
    }
    let updateTemplate = await api.updateTemplate(
      categoryName,
      templateName,
      language,
      component,
      Token,
      route.params.template.id,
      UserMobile
    );
    if (updateTemplate.success == true) {
      Toast.showWithGravity(updateTemplate.message, Toast.LONG, Toast.BOTTOM);
      navigation.navigate("TemplateListScreen");
    } else {
      Toast.showWithGravity(updateTemplate.message, Toast.LONG, Toast.BOTTOM);
    }
  };

  const createTemplate = async () => {
    let array = [];
    for (let i = 0; i < bodyVariableData.length; i++) {
      array.push(bodyVariableData[i].selectedValueKey);
    }
    if (data.length > 0) {
      setPhoneButtonText();
      setVisitWebSiteButtonText();
    }
    let api = new DeveloperAPIClient();
    let UserMobile = await AsyncStorage.getItem("MobileNumber");
    let Token = await AsyncStorage.getItem("token");
    let categoryName = "";
    if (cats != undefined) {
      categoryName = cats;
    }
    let language = "";
    if (
      templateName == null ||
      templateName.length == 0 ||
      templateName.trim() == ""
    ) {
      Toast.showWithGravity(
        "Please enter template name",
        Toast.LONG,
        Toast.BOTTOM
      );
      return false;
    }

    if (
      selectedParentVariable == undefined ||
      selectedParentVariable?.length <= 0
    ) {
      Toast.showWithGravity(
        "Variable cannot save as empty",
        Toast.LONG,
        Toast.BOTTOM
      );
      return false;
    }

    if (cats == undefined) {
      Toast.showWithGravity(
        "Please Select Category Type",
        Toast.LONG,
        Toast.BOTTOM
      );
      return false;
    }

    if (
      !isNaN(templateName[0]) ||
      !/^[a-zA-Z][a-zA-Z0-9\s]*$/.test(templateName[0]) ||
      templateName[0] === "-" ||
      templateName[0] === "@" ||
      templateName[0] === "."
    ) {
      Toast.showWithGravity(
        "Template name should starts with alphabets.",
        Toast.LONG,
        Toast.BOTTOM
      );
      return false;
    }
    if (selectedMediaType == "Text") {
      if (
        mediaTextName == null ||
        mediaTextName == undefined ||
        mediaTextName[0] == "" ||
        mediaTextName == "" ||
        mediaTextName?.length <= 0
      ) {
        Toast.showWithGravity(
          "Please enter header text.",
          Toast.LONG,
          Toast.BOTTOM
        );
        return false;
      }
    }
    if (selectedMediaType == "Media") {
      if (
        (image && image?.url == undefined) ||
        image?.url == null ||
        image?.url == ""
      ) {
        Toast.showWithGravity(
          "Please select header image.",
          Toast.LONG,
          Toast.BOTTOM
        );
        return false;
      }
    }
    if (selectedButtonType == "Call to action") {
      if (callToActionButtonName && callToActionButtonName?.length <= 0) {
        Toast.showWithGravity(
          "Call to action is required any one type of button to create template.",
          Toast.LONG,
          Toast.BOTTOM
        );
        return false;
      }
    }
    if (selectedButtonType == "Quick Reply") {
      if (data && data?.length <= 0) {
        Toast.showWithGravity(
          "Atleast one button is required to create template.",
          Toast.LONG,
          Toast.BOTTOM
        );
        return false;
      }
    }
    for (let i = 0; i < callToActionButtonName.length; i++) {
      if (callToActionButtonName[i]?.name == "Call Phone") {
        if (
          phoneButtonText == null ||
          phoneButtonText == undefined ||
          phoneButtonText[0] == "" ||
          phoneButtonText == "" ||
          phoneButtonText?.length <= 0
        ) {
          Toast.showWithGravity(
            "Please enter phone button text",
            Toast.LONG,
            Toast.BOTTOM
          );
          return false;
        }
        if (
          phoneNumber == null ||
          phoneNumber == undefined ||
          phoneNumber[0] == "" ||
          phoneNumber == "" ||
          phoneNumber?.length <= 0
        ) {
          Toast.showWithGravity(
            "Please enter phone number",
            Toast.LONG,
            Toast.BOTTOM
          );
          return false;
        }
      }
      if (callToActionButtonName[i]?.name == "Visit Website") {
        if (
          visitWebSiteButtonText == null ||
          visitWebSiteButtonText == undefined ||
          visitWebSiteButtonText[0] == "" ||
          visitWebSiteButtonText == "" ||
          visitWebSiteButtonText?.length <= 0
        ) {
          Toast.showWithGravity(
            "Please enter website button text",
            Toast.LONG,
            Toast.BOTTOM
          );
          return false;
        }
        if (
          urlText == null ||
          urlText == undefined ||
          urlText[0] == "" ||
          urlText == "" ||
          urlText?.length <= 0
        ) {
          Toast.showWithGravity(
            "Please enter valid url",
            Toast.LONG,
            Toast.BOTTOM
          );
          return false;
        }
      }
    }
    for (let i = 0; i < data.length; i++) {
      if (
        data[i]?.text == null ||
        data[i]?.text == "" ||
        data[i]?.text?.length <= 0
      ) {
        Toast.showWithGravity(
          "Please enter button text",
          Toast.LONG,
          Toast.BOTTOM
        );
        return false;
      }
    }
    if (selectedLanguage == undefined) {
      Toast.showWithGravity("Please Select Language", Toast.LONG, Toast.BOTTOM);
      return false;
    }
    if (bodyText == null || bodyText.length == 0 || bodyText.trim() == "") {
      Toast.showWithGravity(
        "Body is mandatory field",
        Toast.LONG,
        Toast.BOTTOM
      );
      return false;
    }
    if (selectedLanguage == "English") {
      language = "en_US";
    }
    if (selectedLanguage == "Telugu") {
      language = "te";
    }
    if (selectedLanguage == "عربي") {
      language = "ar";
    }
    if (selectedButtonType == "Quick Reply") {
      if (data && data.length <= 0) {
        Toast.showWithGravity(
          "Atleast on button is mandatory",
          Toast.LONG,
          Toast.BOTTOM
        );
        return false;
      }
    }
    if (selectedButtonType == "Call to action") {
      if (callToActionButtonName && callToActionButtonName.length <= 0) {
        Toast.showWithGravity(
          "Atleast on button is mandatory",
          Toast.LONG,
          Toast.BOTTOM
        );
        return false;
      }
    }

    for (let i = 0; i < callToActionButtonName.length; i++) {
      if (callToActionButtonName[i].name == "Call Phone") {
        if (phoneButtonText?.length <= 0) {
          Toast.showWithGravity(
            "Please add button text for phone",
            Toast.LONG,
            Toast.BOTTOM
          );
          return false;
        }
        if (phoneNumber?.length <= 0) {
          Toast.showWithGravity(
            "Phone number cannot be empty",
            Toast.LONG,
            Toast.BOTTOM
          );
          return false;
        }
      }
      if (callToActionButtonName[i].name == "Visit Website") {
        if (visitWebSiteButtonText?.length <= 0) {
          Toast.showWithGravity(
            "Please add button text for website",
            Toast.LONG,
            Toast.BOTTOM
          );
          return false;
        }
        if (urlText?.length <= 0) {
          Toast.showWithGravity("Please enter url", Toast.LONG, Toast.BOTTOM);
          return false;
        }
      }
    }
    let component = [];
    if (footerText?.length > 0) {
      component.push({
        type: "FOOTER",
        text: footerText,
      });
    }
    if (bodyText.length > 0) {
      component.push({
        type: "BODY",
        text: bodyText.trim(),
        example: {
          body_text: [array?.length > 0 ? array : []],
        },
      });
    }

    if (mediaTextName?.length > 0) {
      component.push({
        type: "HEADER",
        format: selectedMediaType,
        text: mediaTextName.trim(),
        example: {
          media_text: [
            [
              selectedParentVariable
                ? selectedParentVariable.key
                : mediaTextName.trim(),
            ],
          ],
        },
      });
    }
    if (image != undefined) {
      component.push({
        type: "header",
        parameters: [
          {
            type: selectedMediaType,
            image: {
              link: image.url,
            },
          },
        ],
      });
    }
    if (data?.length > 0) {
      component.push({
        type: "BUTTONS",
        buttons: data,
      });
    }
    if (
      phoneButtonText?.length > 0 &&
      (visitWebSiteButtonText?.length <= 0 ||
        visitWebSiteButtonText?.length == undefined)
    ) {
     component.push({
        type: "BUTTONS",
        buttons: [
          {
            type: "PHONE_NUMBER",
            text: phoneButtonText,
            phone_number: phoneNumber,
          },
        ],
      });
    }
    if (
      (phoneButtonText?.length <= 0 || phoneButtonText?.length == undefined) &&
      visitWebSiteButtonText?.length > 0
    ) {
      component.push({
        type: "BUTTONS",
        buttons: [
          {
            type: "URL",
            text: visitWebSiteButtonText,
            url: urlText,
            example: [
              [
                viewWebsiteSelectType == "Dynamic"
                  ? selectedButtonVariable.key
                  : urlText,
              ],
            ],
          },
        ],
      });
    }
    if (phoneButtonText?.length > 0 && visitWebSiteButtonText?.length > 0) {
     component.push({
        type: "BUTTONS",
        buttons: [
          {
            type: "PHONE_NUMBER",
            text: phoneButtonText,
            phone_number: phoneNumber,
          },
          {
            type: "URL",
            text: visitWebSiteButtonText,
            url: urlText,
            example: [
              [
                viewWebsiteSelectType == "Dynamic"
                  ? selectedButtonVariable.key
                  : urlText,
              ],
            ],
          },
        ],
      });
    }
    let createTemplates = await api.getCreateTemplate(
      categoryName,
      templateName,
      language,
      component,
      Token
    );
    if (createTemplates.success == true) {
      Toast.showWithGravity(createTemplates.message, Toast.LONG, Toast.BOTTOM);
      navigation.navigate("TemplateListScreen");
    } else {
      Toast.showWithGravity(createTemplates.message, Toast.LONG, Toast.BOTTOM);
    }
  };

  const updateViewWebsiteSelectedType = async (val) => {
    setVisibleSelectedType(false);
    setViewWebsiteSelectType(val.name);
  };

  const updateMediaType = async (val) => {
    setVisibleHeader(false);
    setSelectedMediaType(val.name);
    setImage();
  };

  const updateSelectedMediaType = async (val) => {
    if (val.name != "Text") {
      setMediaTextName();
    }
    setVisibleHeaderMedia(false);
    setSelectedMedia(val.name);
  };

  const updateBodyVariableData = async (val, i) => {
    setVisibleBodyVariable(false);
    setBodyVariableData((prev) => {
      let array = [...prev];
      array[i].selectedValue = val.label;
      array[i].selectedValueKey = val.key;
      array[i].isModal = false;
      return array;
    });
    let array = [...selectedBodyVariable];
    array.push(val.key);
    setSelectedBodyVariable(array);
  };

  const updateSelectedMediaVariable = async (val) => {
    setVisibleHeaderVariable(false);
    setSelectedParentVariable(val);
  };

  const updateSelectedButtonVariable = async (val) => {
    setVisibleButtonVariableData(false);
    setSelectedButtonVariable(val);
  };

  const updateButtonType = async (val) => {
    if (val.name == "Call to action") {
      setData([]);
    }
    if (val.name == "Quick Reply") {
      handleAddTextInput(val.name);
    }
    setVisibleButtons(false);
    setSelectButtonType(val.name);
  };

  const updateLanguage = async (val) => {
    setSelectedLanguage(val.name);
    setVisibleLanguages(!visibleLanguages);
  };

  const removeInput = (index, input) => {
    if (input.text == "Stop Promotions") {
      setMarketingOPTActive(false);
    }
    if (data?.length == 1) {
      Toast.showWithGravity(
        "Atleast one button is mandatory.",
        Toast.LONG,
        Toast.BOTTOM
      );
      return false;
    }
    let array = [...data];
    array.splice(index, 1);
    setData(array);
  };

  const createFormData = async (photo, timeinmilliseconds, body = {}) => {
    const data = new FormData();
    try {
      let localimagePath = photo[0].name;
      localimagePath =
        localimagePath + "_" + timeinmilliseconds + "." + localimagePath;
    } catch (e) {
      localimagePath = photo[0].name;
    }
    if (selectedMedia == "Image") {
      data.append("sendimage", {
        name: photo[0].name,
        type: photo[0].type,
        uri:
          Platform.OS === "ios"
            ? photo[0].uri.replace("file://", "")
            : photo[0].uri,
      });
    }
    if (selectedMedia == "Video") {
      data.append("sendvideo", {
        name: photo[0].name,
        type: photo[0].type,
        uri:
          Platform.OS === "ios"
            ? photo[0].uri.replace("file://", "")
            : photo[0].uri,
      });
    }

    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });
    return data;
  };

  const uploadImage = async (result) => {
    setLoader(true);
    const d = new Date();
    let time = d.getTime();
    let Token = await AsyncStorage.getItem("token");
    let UserMobile = await AsyncStorage.getItem("MobileNumber");
    const formData = await createFormData(result, time, {
      mobileNumber: UserMobile,
      merchantToken: Token,
    });
    const api = new DeveloperAPIClient();
    let imagedata = await api.getuploadimage(formData);
    if (imagedata?.data?.success != false) {
      setLoader(false);
      setImage(imagedata.data);
    }
    Toast.showWithGravity(imagedata?.data?.message, Toast.LONG, Toast.BOTTOM);
    if (imagedata?.message == "Internal Server Error") {
      setLoader(false);
      Toast.showWithGravity(imagedata.data.message, Toast.LONG, Toast.BOTTOM);
      return false;
    }
    setLoader(false);
  };

  const uploadDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      if (selectedMedia == "Image") {
        return await uploadImage(result);
      }
      if (selectedMedia == "Video") {
        return await uploadImage(result);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        throw err;
      }
    }
  };

  const removeButtonType = (item, index) => {
    let result = [...callToActionButtonName];
    result.splice(index, 1);
    if (result[0]?.name == "Call Phone") {
      setVisitWebSiteButtonText();
      setUrlText();
    }
    if (result[0]?.name == "Visit Website") {
      setPhoneButtonText();
      setPhoneNumber();
    }
    setCallToActionButtonName(result);
  };

  const onAddQuickReplayButtons = (index, val) => {
    setData((prev) => {
      let obj = [...prev];
      obj[index].text = val;
      return obj;
    });
  };

  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === "Backspace") {
      const deletedValue = mediaTextName.slice(-1);
      if (deletedValue == "}") {
        setMediaPlaceHolderSelected(false);
      }
      setMediaTextName(deletedValue);
    }
  };

  const addMediaVariable = () => {
    setVariable(true);
    if (mediaTextName != undefined) {
      setMediaTextName(
        mediaTextName + " " + `{{${JSON.parse(variableCount)}}}`
      );
    } else {
      setMediaTextName(`{{${variableCount}}}`);
    }
  };

  const addButtonVariable = () => {
    setButtonVariable(true);
    if (urlText != undefined) {
      setUrlText(urlText + " " + `{{${JSON.parse(1)}}}`);
    } else {
      setUrlText(`{{${1}}}`);
    }
  };

  const onRemoveVariableFromBodyName = (val) => {
    let finalText = "";
    if (bodyText.includes(val)) {
      finalText = bodyText.replace(val, "");
      setBodyText(finalText);
      setBodyVariableCount(bodyVariableData?.length);
    }
  };

  const onChangeBodyName = (val) => {
    setBodyText(val);
  };
  const onChangeMediaName = (val) => {
    setSelectedChildVariable();
    setSelectedParentVariable();
    if (!variable) {
      if (val?.includes(`{{1}}`)) {
        setVariable(true);
      }
    }
    // if(variable){
    const desiredValue = "{{1}}{{1}}";
    const desiredValue1 = "{{1}} {{1}}";
    const desiredValue2 = "{{1}}  {{1}}";
    const desiredValue3 = "{{1}}   {{1}}";
    const desiredValue4 = "{{1}}    {{1}}";
    const desiredValue5 = "{{1}}     {{1}}";
    const desiredValue6 = "{{1}}      {{1}}";
    const selectedVariable = `{{${selectedParentVariable}.${selectedChildVariable}}}{{1}}`;
    let valueExists = "";
    if (val.includes(desiredValue)) {
      valueExists = val.includes(desiredValue);
      const updatedValue = val.replace(desiredValue?.trim(), "{{1}}");
      setMediaTextName(updatedValue);
      return false;
    } else {
      setMediaTextName(val);
    }
    if (val.includes(selectedVariable)) {
      valueExists = val.includes(selectedVariable);
      const updatedValue = val.replace(
        selectedVariable?.trim(),
        `{{${selectedParentVariable}.${selectedChildVariable}}}`
      );
      setMediaTextName(updatedValue);
    } else {
      setMediaTextName(val);
    }
    if (val.includes(desiredValue1)) {
      valueExists = val.includes(desiredValue1);
      const updatedValue = val.replace(desiredValue1?.trim(), "{{1}}");
      setMediaTextName(updatedValue);
      return false;
    } else {
      setMediaTextName(val);
    }
    if (val.includes(desiredValue2)) {
      valueExists = val.includes(desiredValue2);
      const updatedValue = val.replace(desiredValue2?.trim(), "{{1}}");
      setMediaTextName(updatedValue);
      return false;
    } else {
      setMediaTextName(val);
    }
    if (val.includes(desiredValue3)) {
      valueExists = val.includes(desiredValue3);
      const updatedValue = val.replace(desiredValue3?.trim(), "{{1}}");
      setMediaTextName(updatedValue);
      return false;
    } else {
      setMediaTextName(val);
    }
    if (val.includes(desiredValue4)) {
      valueExists = val.includes(desiredValue4);
      const updatedValue = val.replace(desiredValue4?.trim(), "{{1}}");
      setMediaTextName(updatedValue);
      return false;
    } else {
      setMediaTextName(val);
    }
    if (val.includes(desiredValue5)) {
      valueExists = val.includes(desiredValue5);
      const updatedValue = val.replace(desiredValue5?.trim(), "{{1}}");
      setMediaTextName(updatedValue);
      return false;
    } else {
      setMediaTextName(val);
    }
    if (val.includes(desiredValue6)) {
      valueExists = val.includes(desiredValue6);
      const updatedValue = val.replace(desiredValue6?.trim(), "{{1}}");
      setMediaTextName(updatedValue);
      return false;
    } else {
      setMediaTextName(val);
    }
    // }else{
    setMediaTextName(val);
    // }
  };

  const onChangeURLText = (val) => {
    if (!buttonVariable) {
      if (val?.includes(`{{1}}`)) {
        setButtonVariable(true);
      }
    }
    // if(variable){
    const desiredValue = "{{1}}{{1}}";
    const desiredValue1 = "{{1}} {{1}}";
    const desiredValue2 = "{{1}}  {{1}}";
    const desiredValue3 = "{{1}}   {{1}}";
    const desiredValue4 = "{{1}}    {{1}}";
    const desiredValue5 = "{{1}}     {{1}}";
    const desiredValue6 = "{{1}}      {{1}}";
    let valueExists = "";
    if (val.includes(desiredValue)) {
      valueExists = val.includes(desiredValue);
      const updatedValue = val.replace(desiredValue?.trim(), "{{1}}");
      setUrlText(updatedValue);
      return false;
    } else {
      setUrlText(val);
    }
    if (val.includes(desiredValue1)) {
      valueExists = val.includes(desiredValue1);
      const updatedValue = val.replace(desiredValue1?.trim(), "{{1}}");
      setUrlText(updatedValue);
      return false;
    } else {
      setUrlText(val);
    }
    if (val.includes(desiredValue2)) {
      valueExists = val.includes(desiredValue2);
      const updatedValue = val.replace(desiredValue2?.trim(), "{{1}}");
      setUrlText(updatedValue);
      return false;
    } else {
      setUrlText(val);
    }
    if (val.includes(desiredValue3)) {
      valueExists = val.includes(desiredValue3);
      const updatedValue = val.replace(desiredValue3?.trim(), "{{1}}");
      setUrlText(updatedValue);
      return false;
    } else {
      setUrlText(val);
    }
    if (val.includes(desiredValue4)) {
      valueExists = val.includes(desiredValue4);
      const updatedValue = val.replace(desiredValue4?.trim(), "{{1}}");
      setUrlText(updatedValue);
      return false;
    } else {
      setUrlText(val);
    }
    if (val.includes(desiredValue5)) {
      valueExists = val.includes(desiredValue5);
      const updatedValue = val.replace(desiredValue5?.trim(), "{{1}}");
      setUrlText(updatedValue);
      return false;
    } else {
      setUrlText(val);
    }
    if (val.includes(desiredValue6)) {
      valueExists = val.includes(desiredValue6);
      const updatedValue = val.replace(desiredValue6?.trim(), "{{1}}");
      setUrlText(updatedValue);
      return false;
    } else {
      setUrlText(val);
    }
    // }else{
    setUrlText(val);
    // }
  };

  const removeBodyVariable = (index, input) => {
    let array = [...bodyVariableData];
    array.splice(index - 1, 1);
    setBodyVariableData(array);
    onRemoveVariableFromBodyName(`{{${bodyVariableData?.length}}}`);
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
        <View style={{ marginLeft: 1 }}>
          <Text
            style={{
              color: "#2B2520",
              fontFamily: "Poppins-Medium",
              fontSize: 20,
            }}
          >
            {route?.params?.template != undefined
              ? "Edit Template"
              : "Create Template"}
          </Text>
        </View>
      </View>

      <ScrollView>
        <View style={{ marginTop: 10 }}>
          <Text style={{ marginLeft: 12, fontFamily: "Poppins-Medium" }}>
            Category
          </Text>
        </View>
        <View
          style={{
            height: 40,
            width: "93.5%",
            padding: 10,
            backgroundColor: "#F7F7FC",
            marginLeft: 12,
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
                <Text numberOfLines={1} style={{}}>
                  {cats != undefined ? cats : "Please Select Category"}
                </Text>
                <View>
                  <Image
                    style={{ height: 20, width: 15 }}
                    source={require("../../assets/ddarrow.png")}
                  />
                </View>
              </TouchableOpacity>
            }
          >
            {categoryType &&
              categoryType.map((val, i) => {
                return (
                  <Menu.Item
                    key={i}
                    title={decode(val.name)}
                    onPress={() => updatecat(val)}
                  />
                );
              })}
          </Menu>
        </View>
        <View style={{ marginTop: 10, flexDirection: "row" }}>
          <Text style={{ marginLeft: 12, fontFamily: "Poppins-Medium" }}>
            Template Name
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
          maxLength={20}
          placeholder="Template Name"
          onChangeText={(val) => setTemplateName(val)}
          value={templateName}
        />
        <View style={{ marginTop: 10 }}>
          <Text style={{ marginLeft: 12, fontFamily: "Poppins-Medium" }}>
            Language
          </Text>
        </View>
        <View
          style={{
            height: 40,
            width: "93.5%",
            padding: 10,
            backgroundColor: "#F7F7FC",
            marginLeft: 12,
          }}
        >
          <Menu
            visible={visibleLanguages}
            onDismiss={() => setVisibleLanguages(!visibleLanguages)}
            anchor={
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginHorizontal: 10,
                }}
                activeOpacity={0.7}
                onPress={() => setVisibleLanguages(!visibleLanguages)}
              >
                <Text numberOfLines={1} style={{}}>
                  {selectedLanguage ? selectedLanguage : "Select Language"}
                </Text>
                <View>
                  <Image
                    style={{ height: 20, width: 15 }}
                    source={require("../../assets/ddarrow.png")}
                  />
                </View>
              </TouchableOpacity>
            }
          >
            {languages &&
              languages.map((val, i) => {
                return (
                  <Menu.Item
                    key={i}
                    title={val.name}
                    onPress={() => updateLanguage(val)}
                  />
                );
              })}
          </Menu>
        </View>
        <View style={{ marginTop: 10 }}>
          <Divider />
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: "row", marginTop: 15 }}>
            <Text
              style={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 18,
                marginLeft: 12,
              }}
            >
              Header
            </Text>
            <Text
              style={{
                fontFamily: "Poppins",
                fontSize: 15,
                color: "#949693",
                marginTop: 3,
              }}
            >
              (Optional)
            </Text>
          </View>
          <Text style={{ marginLeft: 12 }}>
            Add a title or choose which type of media you'll use for this
            header.{"\n"}
            Your title can't include more than one variable.
          </Text>
          <View
            style={{
              height: 40,
              width: "50%",
              padding: 10,
              backgroundColor: "#F7F7FC",
              marginLeft: 12,
              marginTop: 15,
            }}
          >
            <Menu
              visible={visibleHeader}
              onDismiss={() => setVisibleHeader(!visibleHeader)}
              anchor={
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginHorizontal: 10,
                  }}
                  activeOpacity={0.7}
                  onPress={() => setVisibleHeader(!visibleHeader)}
                >
                  <Text numberOfLines={1} style={{}}>
                    {decode(selectedMediaType ? selectedMediaType : "None")}
                  </Text>
                  <View>
                    <Image
                      style={{ height: 20, width: 15 }}
                      source={require("../../assets/ddarrow.png")}
                    />
                  </View>
                </TouchableOpacity>
              }
            >
              {HeadersList &&
                HeadersList.map((val, i) => {
                  return (
                    <Menu.Item
                      key={i}
                      title={decode(val.name)}
                      onPress={() => updateMediaType(val)}
                    />
                  );
                })}
            </Menu>
          </View>
        </View>
        {selectedMediaType == "Text" && (
          <View>
            <TextInput
              style={{
                height: 40,
                width: "91%",
                margin: 12,
                padding: 10,
                backgroundColor: "#F7F7FC",
                fontFamily: "Poppins-Regular",
              }}
              maxLength={60}
              placeholder="Enter Text"
              onChangeText={(val) => onChangeMediaName(val)}
              onKeyPress={({ nativeEvent }) => {
                // Check if the "Backspace" key is pressed
                if (nativeEvent.key === "Backspace") {
                  // Save the current value before deletion
                  if (
                    mediaTextName[mediaTextName.length - 1] == "}" ||
                    mediaTextName[mediaTextName.length - 1] == "{"
                  ) {
                    setVariable(false);
                  }
                }
              }}
              value={mediaTextName}
            />
            {!variable && (
              <TouchableOpacity
                onPress={() => !variable && addMediaVariable()}
                style={{ marginLeft: "auto", marginRight: 20 }}
              >
                <Text style={{ fontFamily: "Poppins-Medium" }}>
                  + Add Variable
                </Text>
              </TouchableOpacity>
            )}
            {variable && (
              <>
                <View
                  style={{
                    height: 40,
                    width: "90%",
                    padding: 10,
                    backgroundColor: "#F7F7FC",
                    marginLeft: 12,
                    marginTop: 15,
                  }}
                >
                  <Menu
                    visible={visibleHeaderVariable}
                    onDismiss={() =>
                      setVisibleHeaderVariable(!visibleHeaderVariable)
                    }
                    anchor={
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginHorizontal: 10,
                        }}
                        activeOpacity={0.7}
                        onPress={() =>
                          setVisibleHeaderVariable(!visibleHeaderVariable)
                        }
                      >
                        <Text numberOfLines={1} style={{}}>
                          {decode(
                            selectedParentVariable
                              ? selectedParentVariable.label
                              : "Please Select Variable Data"
                          )}
                        </Text>
                        <View>
                          <Image
                            style={{ height: 20, width: 15 }}
                            source={require("../../assets/ddarrow.png")}
                          />
                        </View>
                      </TouchableOpacity>
                    }
                  >
                    {variableData &&
                      variableData.map((val, i) => {
                        return (
                          <Menu.Item
                            key={i}
                            title={decode(val.label)}
                            onPress={() => updateSelectedMediaVariable(val)}
                          />
                        );
                      })}
                  </Menu>
                </View>
              </>
            )}
          </View>
        )}

        {selectedMediaType == "Media" && (
          <View
            style={{
              height: 40,
              width: "50%",
              padding: 10,
              backgroundColor: "#F7F7FC",
              marginLeft: 12,
              marginTop: 15,
            }}
          >
            <Menu
              visible={visibleHeaderMedia}
              onDismiss={() => setVisibleHeaderMedia(!visibleHeaderMedia)}
              anchor={
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginHorizontal: 10,
                  }}
                  activeOpacity={0.7}
                  onPress={() => setVisibleHeaderMedia(!visibleHeaderMedia)}
                >
                  <Text numberOfLines={1} style={{}}>
                    {decode(selectedMedia)}
                  </Text>
                  <View>
                    <Image
                      style={{ height: 20, width: 15 }}
                      source={require("../../assets/ddarrow.png")}
                    />
                  </View>
                </TouchableOpacity>
              }
            >
              {HeadersMediaList &&
                HeadersMediaList.map((val, i) => {
                  return (
                    <Menu.Item
                      key={i}
                      title={decode(val.name)}
                      onPress={() => updateSelectedMediaType(val)}
                    />
                  );
                })}
            </Menu>
          </View>
        )}
        {selectedMediaType == "Media" && (
          <TouchableOpacity
            style={{
              marginTop: 18,
              width: "40%",
              height: 38,
              paddingTop: 8,
              paddingBottom: 15,
              backgroundColor: "#51AF5E",
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#fff",
              marginLeft: "30%",
            }}
            onPress={() => uploadDocument()}
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
              Upload {selectedMedia}
            </Text>
          </TouchableOpacity>
        )}
        {image && (
          // <View style={{
          //   height: '2%',
          //   width: "60%",
          //   borderRadius: 15,
          //   borderWidth: 1,
          //   borderColor: "#3AA44D",
          //   marginLeft: 19, flexDirection: 'row', marginTop: 10
          // }}>
          //   {/* <Image style={{
          //     width: 150,
          //     height: 100,
          //     resizeMode: "center",
          //     marginTop: 20,
          //   }} source={{ uri: image.url }} /> */}
          //   <Text style={{
          //     fontFamily: 'Poppins-Regular', fontSize: 12,
          //     marginHorizontal: 10, marginVertical: 5, textAlign: 'center'
          //   }}>{image?.path?.length > 25 ? `${image?.path?.substring(0, 25)}...` : image?.path}</Text>
          //   <TouchableOpacity onPress={() => setImage()} style={{
          //     marginLeft: 'auto',
          //     marginLeft: 0, marginTop: 3,
          //   }}>
          //     <Image
          //       style={{
          //         marginTop: 3,
          //         width: 15,
          //         height: 15,
          //         resizeMode: "center",
          //       }}
          //       source={require("../../assets/cross.png")}
          //     />
          //   </TouchableOpacity>
          // </View>
          <>
            {loader ? (
              <ActivityIndicator color="#51AF5E" size="small" />
            ) : (
              <Image
                style={{
                  width: 150,
                  height: 100,
                  resizeMode: "center",
                  marginTop: 20,
                }}
                source={{ uri: image.url }}
              />
            )}
          </>
        )}
        <View style={{ marginTop: 10 }}>
          <Divider />
        </View>

        <View style={{ marginTop: 15 }}>
          <Text
            style={{
              fontFamily: "Poppins-SemiBold",
              fontSize: 18,
              marginLeft: 12,
            }}
          >
            Body
          </Text>
          <Text style={{ marginLeft: 12 }}>
            To add a custom variable, please add a variable in double curly
            brackets without a space.{"\n"}
          </Text>
          <TextInput
            style={{
              height: 100,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "#3AA44D",
              marginLeft: 12,
              marginRight: 12,
              marginTop: "5%",
              backgroundColor: "#F7F7FC",
              textAlignVertical: "top",
            }}
            onChangeText={(val) => onChangeBodyName(val)}
            value={bodyText}
            placeholder="Template Message..."
            maxLength={1024}
            onKeyPress={({ nativeEvent }) => {
              // Check if the "Backspace" key is pressed
              if (nativeEvent.key === "Backspace") {
                // Save the current value before deletion
                if (
                  bodyText[bodyText.length - 1] == "}" ||
                  bodyText[bodyText.length - 1] == "{"
                ) {
                  removeBodyVariable(bodyVariableData.length);
                }
              }
            }}
          />
          <>
            <TouchableOpacity
              onPress={() => handleAddBodyVariable()}
              style={{ marginLeft: "auto", marginRight: 20 }}
            >
              <Text style={{ fontFamily: "Poppins-Medium" }}>
                + Add Variable
              </Text>
            </TouchableOpacity>
            {bodyVariableData &&
              bodyVariableData.map((input, index) => {
                return (
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={{
                        height: 40,
                        width: "18%",
                        padding: 10,
                        backgroundColor: "#F7F7FC",
                        marginLeft: 12,
                        marginTop: 15,
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginHorizontal: 10,
                        }}
                        activeOpacity={0.7}
                        onPress={() =>
                          setVisibleBodyVariable(!visibleBodyVariable)
                        }
                      >
                        <Text numberOfLines={1} style={{}}>
                          {`{{${index + 1}}}`}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        height: 40,
                        width: "60%",
                        padding: 10,
                        backgroundColor: "#F7F7FC",
                        marginLeft: 12,
                        marginTop: 15,
                      }}
                    >
                      <Menu
                        visible={input.isModal}
                        onDismiss={() =>
                          setBodyVariableData((prev) => {
                            let array = [...prev];
                            array[index].isModal = !input.isModal;
                            return array;
                          })
                        }
                        anchor={
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginHorizontal: 10,
                            }}
                            activeOpacity={0.7}
                            onPress={() =>
                              setBodyVariableData((prev) => {
                                let array = [...prev];
                                array[index].isModal = !input.isModal;
                                return array;
                              })
                            }
                          >
                            <Text numberOfLines={1} style={{}}>
                              {input?.selectedValue != undefined
                                ? input?.selectedValue
                                : "Please Select Variable Data"}
                            </Text>
                            <View>
                              <Image
                                style={{ height: 20, width: 15 }}
                                source={require("../../assets/ddarrow.png")}
                              />
                            </View>
                          </TouchableOpacity>
                        }
                      >
                        {variableData &&
                          variableData.map((val, i) => {
                            return (
                              <Menu.Item
                                key={i}
                                title={decode(val.label)}
                                onPress={() =>
                                  updateBodyVariableData(val, index)
                                }
                              />
                            );
                          })}
                      </Menu>
                    </View>
                    <TouchableOpacity
                      onPress={() => removeBodyVariable(index, input)}
                      style={{
                        marginTop: "7.5%",
                        marginLeft: "auto",
                        marginRight: 15,
                      }}
                    >
                      <Image
                        style={{
                          width: 20,
                          height: 20,
                          flexDirection: "row",
                        }}
                        source={require("../../assets/delete.png")}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
          </>
        </View>
        <View style={{ marginTop: 10 }}>
          <Divider />
        </View>

        <View style={{ marginTop: 15 }}>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 18,
                marginLeft: 12,
              }}
            >
              Footer
            </Text>
            <Text
              style={{
                fontFamily: "Poppins",
                fontSize: 15,
                color: "#949693",
                marginTop: 3,
              }}
            >
              (Optional)
            </Text>
          </View>
          <Text style={{ marginLeft: 12 }}>
            Add a short line of text to the bottom of your message template.
            {"\n"}
          </Text>
          <TextInput
            style={{
              height: 40,
              width: "91%",
              margin: 12,
              padding: 10,
              backgroundColor: "#F7F7FC",
              fontFamily: "Poppins-Regular",
            }}
            value={footerText}
            onChangeText={(val) => setFooterText(val)}
            maxLength={60}
            placeholder="Enter Text"
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <Divider />
        </View>

        <View style={{ marginTop: 15 }}>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 18,
                marginLeft: 12,
              }}
            >
              Buttons
            </Text>
            <Text
              style={{
                fontFamily: "Poppins",
                fontSize: 15,
                color: "#949693",
                marginTop: 3,
              }}
            >
              (Optional)
            </Text>
          </View>
          <Text style={{ marginLeft: 12 }}>
            Create buttons that let customers respond to your message or take
            action.{"\n"}
          </Text>
          <View
            style={{
              height: 40,
              width: "90%",
              padding: 10,
              backgroundColor: "#F7F7FC",
              marginLeft: 12,
              marginTop: 15,
            }}
          >
            <Menu
              visible={visibleButtons}
              onDismiss={() => setVisibleButtons(!visibleButtons)}
              anchor={
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginHorizontal: 10,
                  }}
                  activeOpacity={0.7}
                  onPress={() => setVisibleButtons(!visibleButtons)}
                >
                  <Text numberOfLines={1} style={{}}>
                    {selectedButtonType ? selectedButtonType : "None"}
                  </Text>
                  <View>
                    <Image
                      style={{ height: 20, width: 15 }}
                      source={require("../../assets/ddarrow.png")}
                    />
                  </View>
                </TouchableOpacity>
              }
            >
              {ButtonsList &&
                ButtonsList.map((val, i) => {
                  return (
                    <Menu.Item
                      key={i}
                      title={decode(val.name)}
                      // disabled={disabledItems.includes(val)}
                      onPress={() => updateButtonType(val)}
                    />
                  );
                })}
            </Menu>
          </View>
        </View>
        <View>
          {selectedButtonType == "Quick Reply" && (
            <>
              <TouchableOpacity
                style={{
                  marginTop: 10,
                  width: "15%",
                  height: 45,
                  paddingTop: 9,
                  paddingBottom: 15,
                  borderRadius: 5,
                  backgroundColor: data.length >= 3 ? "#969696" : "#008080",
                  marginBottom: "5%",
                  marginLeft: "auto",
                  marginRight: 13,
                }}
                onPress={() => handleAddTextInput(selectedButtonType)}
              >
                <Text
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 11,
                    fontFamily: "Poppins-Medium",
                  }}
                >
                  Add Button
                </Text>
              </TouchableOpacity>
              {cats == "MARKETING" && !marketingOPTActive && (
                <TouchableOpacity
                  onPress={() => onAddMarketingOpt()}
                  style={{ marginLeft: 20 }}
                >
                  <Text style={{ fontFamily: "Poppins-Medium" }}>
                    + Marketing opt-out
                  </Text>
                </TouchableOpacity>
              )}
              {data.length > 0 &&
                data.map((input, index) => (
                  <>
                    <View style={{ flexDirection: "row", width: "100%" }}>
                      <TextInput
                        style={{
                          height: 40,
                          margin: 12,
                          padding: 10,
                          backgroundColor: "#F7F7FC",
                          fontFamily: "Poppins-Regular",
                          width: "80%",
                        }}
                        onChangeText={(val) =>
                          onAddQuickReplayButtons(index, val)
                        }
                        value={input.text}
                        maxLength={20}
                        placeholder={`Button Text ${index + 1}`}
                        editable={
                          input.text == "Stop Promotions" ? false : true
                        }
                      />
                      <TouchableOpacity
                        onPress={() => removeInput(index, input)}
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft: "auto",
                          marginRight: "5%",
                        }}
                      >
                        <Image
                          style={{
                            width: 25,
                            height: 25,
                          }}
                          source={require("../../assets/delete.png")}
                        />
                      </TouchableOpacity>
                    </View>
                  </>
                ))}
            </>
          )}
        </View>
        <View>
          {selectedButtonType == "Call to action" && (
            <>
              <View
                style={{
                  height: 40,
                  width: "90%",
                  padding: 10,
                  backgroundColor: "#F7F7FC",
                  marginLeft: 12,
                  marginTop: 10,
                }}
              >
                <Menu
                  visible={visibleCallToActionButtons}
                  onDismiss={() =>
                    setVisibleCallToActionButtons(!visibleCallToActionButtons)
                  }
                  anchor={
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginHorizontal: 10,
                      }}
                      activeOpacity={0.7}
                      onPress={() =>
                        setVisibleCallToActionButtons(
                          !visibleCallToActionButtons
                        )
                      }
                    >
                      <Text numberOfLines={1} style={{}}>
                        Select Button Type
                      </Text>
                      <View>
                        <Image
                          style={{ height: 20, width: 15 }}
                          source={require("../../assets/ddarrow.png")}
                        />
                      </View>
                    </TouchableOpacity>
                  }
                >
                  {callToActionButtonList &&
                    callToActionButtonList.map((val, i) => {
                      return (
                        <Menu.Item
                          // disabled={disabledItems.includes(val)}
                          key={i}
                          title={decode(val.name)}
                          onPress={() => updateCallToActionButton(val)}
                        />
                      );
                    })}
                </Menu>
              </View>
              {callToActionButtonName &&
                callToActionButtonName.map((val, i) => {
                  return (
                    <View>
                      {val.name === "Visit Website" && (
                        <View>
                          <View style={{ marginTop: 10, flexDirection: "row" }}>
                            <Text
                              style={{
                                marginLeft: 12,
                                fontFamily: "Poppins-Medium",
                              }}
                            >
                              Button Type : {val.name}
                            </Text>
                            <View
                              style={{ marginLeft: "auto", marginRight: 10 }}
                            >
                              <TouchableOpacity
                                onPress={() => removeButtonType(val, i)}
                              >
                                <Image
                                  style={{
                                    width: 25,
                                    height: 25,
                                  }}
                                  source={require("../../assets/delete.png")}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <View style={{ marginTop: 5 }} />
                          <Divider />
                          <View style={{ width: "97%" }}>
                            <TextInput
                              style={{
                                height: 40,
                                margin: 12,
                                padding: 10,
                                backgroundColor: "#F7F7FC",
                                fontFamily: "Poppins-Regular",
                              }}
                              maxLength={20}
                              placeholder="Button Text"
                              value={visitWebSiteButtonText}
                              onChangeText={(val) =>
                                setVisitWebSiteButtonText(val)
                              }
                            />
                          </View>
                          <View
                            style={{
                              height: 40,
                              width: "90%",
                              padding: 10,
                              backgroundColor: "#F7F7FC",
                              marginLeft: 12,
                              marginTop: 10,
                            }}
                          >
                            <Menu
                              visible={visibleSelectedType}
                              onDismiss={() =>
                                setVisibleSelectedType(!visibleSelectedType)
                              }
                              anchor={
                                <TouchableOpacity
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginHorizontal: 10,
                                  }}
                                  activeOpacity={0.7}
                                  onPress={() =>
                                    setVisibleSelectedType(!visibleSelectedType)
                                  }
                                >
                                  <Text numberOfLines={1} style={{}}>
                                    {decode(viewWebsiteSelectType)}
                                  </Text>
                                  <View>
                                    <Image
                                      style={{ height: 20, width: 15 }}
                                      source={require("../../assets/ddarrow.png")}
                                    />
                                  </View>
                                </TouchableOpacity>
                              }
                            >
                              {viewWebsiteTypes &&
                                viewWebsiteTypes.map((val, i) => {
                                  return (
                                    <Menu.Item
                                      key={i}
                                      title={decode(val.name)}
                                      onPress={() =>
                                        updateViewWebsiteSelectedType(val)
                                      }
                                    />
                                  );
                                })}
                            </Menu>
                          </View>
                          <View style={{ width: "97%" }}>
                            <TextInput
                              style={{
                                height: 40,
                                margin: 12,
                                padding: 10,
                                backgroundColor: "#F7F7FC",
                                fontFamily: "Poppins-Regular",
                              }}
                              maxLength={100}
                              placeholder={
                                viewWebsiteSelectType == "Static"
                                  ? "https://www.wati.com"
                                  : "https://www.wati.com/{{1}}"
                              }
                              onChangeText={(val) => onChangeURLText(val)}
                              value={urlText}
                              onKeyPress={({ nativeEvent }) => {
                                // Check if the "Backspace" key is pressed
                                if (nativeEvent.key === "Backspace") {
                                  // Save the current value before deletion
                                  if (
                                    urlText[urlText.length - 1] == "}" ||
                                    urlText[urlText.length - 1] == "{"
                                  ) {
                                    setButtonVariable(false);
                                  }
                                }
                              }}
                            />
                          </View>
                          {viewWebsiteSelectType == "Dynamic" && (
                            <TouchableOpacity
                              style={{ marginLeft: "auto", marginRight: 20 }}
                              onPress={() =>
                                !buttonVariable && addButtonVariable()
                              }
                            >
                              <Text style={{ fontFamily: "Poppins-Medium" }}>
                                + Add Variable
                              </Text>
                            </TouchableOpacity>
                          )}
                          <>
                            {buttonVariable && (
                              <>
                                <View
                                  style={{
                                    height: 40,
                                    width: "90%",
                                    padding: 10,
                                    backgroundColor: "#F7F7FC",
                                    marginLeft: 12,
                                    marginTop: 15,
                                  }}
                                >
                                  <Menu
                                    visible={visibleButtonVariableData}
                                    onDismiss={() =>
                                      setVisibleButtonVariableData(
                                        !visibleButtonVariableData
                                      )
                                    }
                                    anchor={
                                      <TouchableOpacity
                                        style={{
                                          flexDirection: "row",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                          marginHorizontal: 10,
                                        }}
                                        activeOpacity={0.7}
                                        onPress={() =>
                                          setVisibleButtonVariableData(
                                            !visibleButtonVariableData
                                          )
                                        }
                                      >
                                        <Text numberOfLines={1} style={{}}>
                                          {decode(
                                            selectedButtonVariable
                                              ? selectedButtonVariable.label
                                              : "Please Select Variable Data"
                                          )}
                                        </Text>
                                        <View>
                                          <Image
                                            style={{ height: 20, width: 15 }}
                                            source={require("../../assets/ddarrow.png")}
                                          />
                                        </View>
                                      </TouchableOpacity>
                                    }
                                  >
                                    {variableData &&
                                      variableData.map((val, i) => {
                                        return (
                                          <Menu.Item
                                            key={i}
                                            title={decode(val.label)}
                                            onPress={() =>
                                              updateSelectedButtonVariable(val)
                                            }
                                          />
                                        );
                                      })}
                                  </Menu>
                                </View>
                              </>
                            )}
                          </>
                        </View>
                      )}

                      {val.name === "Call Phone" && (
                        <View>
                          <View style={{ marginTop: 10, flexDirection: "row" }}>
                            <Text
                              style={{
                                marginLeft: 12,
                                fontFamily: "Poppins-Medium",
                              }}
                            >
                              Button Type : {val.name}
                            </Text>
                            <View
                              style={{ marginLeft: "auto", marginRight: 10 }}
                            >
                              <TouchableOpacity
                                onPress={() => removeButtonType(val, i)}
                              >
                                <Image
                                  style={{
                                    width: 25,
                                    height: 25,
                                  }}
                                  source={require("../../assets/delete.png")}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                          <View style={{ marginTop: 5 }} />
                          <Divider />
                          <View style={{ width: "97%" }}>
                            <TextInput
                              style={{
                                height: 40,
                                margin: 12,
                                padding: 10,
                                backgroundColor: "#F7F7FC",
                                fontFamily: "Poppins-Regular",
                              }}
                              maxLength={20}
                              placeholder="Button Text"
                              onChangeText={(val) => setPhoneButtonText(val)}
                              value={phoneButtonText}
                            />
                          </View>
                          <View style={{ width: "97%" }}>
                            <TextInput
                              style={{
                                height: 40,
                                margin: 12,
                                padding: 10,
                                backgroundColor: "#F7F7FC",
                                fontFamily: "Poppins-Regular",
                              }}
                              maxLength={20}
                              placeholder="Phone Number With Country Code"
                              keyboardType="numeric"
                              onChangeText={(val) => setPhoneNumber(val)}
                              value={phoneNumber}
                            />
                          </View>
                        </View>
                      )}
                    </View>
                  );
                })}
            </>
          )}
        </View>
        <View style={{ marginTop: 10 }}>
          <Divider />
        </View>

        <TouchableOpacity
          onPress={() =>
            route?.params?.template != undefined
              ? updateTemplate()
              : createTemplate()
          }
          style={{
            height: 44,
            width: "90%",
            backgroundColor: "#3AA44D",
            borderRadius: 6,
            borderWidth: 1,
            borderColor: "#3AA44D",
            marginLeft: 19,
            marginTop: "8%",
            marginBottom: "8%",
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              marginTop: 8,
              fontSize: 15,
              fontFamily: "Poppins-SemiBold",
            }}
          >
            Save and submit
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default EditTemplateScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFF",
  },
});
