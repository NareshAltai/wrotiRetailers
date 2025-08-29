import RestClient from 'react-native-rest-client';
import Api from './Api';
  
const merchantId = "67c048a5-d13b-42d7-b68c-84f2862dd4e6";
const FRONT_API_URL = "https://sg-frontapi.ecom.capillary.in/v3";
 
export default class FrontAPIClient extends RestClient {
  constructor (authToken) {
    super('https://api.myawesomeservice.com');
  }

 
  getProductsURLByTag(tagId){
    return `${FRONT_API_URL}/${merchantId}/products?include-unavailable=false&include-post-details=false&product-tags=${tagId}&show-only-default-bundle-data=true`;
  }

  getProductsByTag =async (tagId) => {
    let url = this.getProductsURLByTag(tagId);
    let apiResponse = await Api.get(url,{},'','',{ 'Content-Type': 'application/json',});
    return apiResponse.data.resource;
  }

  getBannersURL(){

    return `${FRONT_API_URL}/${merchantId}/banners?show-inactive=false`;

  }

  getConfig =async() => {
    let url = this.getConfgURL();

    let apiResponse = await Api.get(url,{},'','',{ 'Content-Type': 'application/json',});
    return apiResponse;
 

  }
  getNavigationURL(navId){

    return `${FRONT_API_URL}/${merchantId}/navigations/${navId}`;

  }

  getNavigationData = async(navId) =>{

    let url = this.getNavigationURL(navId);

    let apiResponse = await Api.get(url,{},'','',{ 'Content-Type': 'application/json',});
    let formattedNavigations = [];
    if(apiResponse.data){

       let navigations = apiResponse.data.resource.childNavigations;
      
       formattedNavigations.push({"itemName":"HOME", "itemvalue" : "", childer:[],type:"content" });
       for(let i = 0 ; i < navigations.length; i++){
         
           let navigationItem = navigations[i];
           formattedNavigations.push({"itemName":navigationItem.itemName, "itemvalue" : navigationItem.itemvalue, childer:[],type:"category" });

       }


    }
    return formattedNavigations;
 
  }

  getConfgURL(){
    return `${FRONT_API_URL}/${merchantId}/configs`;
  }

  getBanners = async(storeid) =>{

   let url = this.getBannersURL();
   console.log(url);

   let apiResponse = await Api.get(url,{},'','',{ 'Content-Type': 'application/json',});
   //console.log("banners",apiResponse.data);

   let resource = apiResponse.data.resource;
   let bannerMap = {};
   for(let i = 0; i<resource.length; i++){
     let refCode = resource[i].refCode;
     if(!bannerMap[refCode])
           bannerMap[refCode] = [];
     bannerMap[refCode].push( resource[i])      


   }

   return bannerMap;


  }
  
};