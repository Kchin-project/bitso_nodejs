'use strict'

const axios = require('axios');
var qs =  require('qs');

var usersRequests = {};

module.exports = {
  api: process.env.bitsoApi || "",
  secret: process.env.bitsoSecret || "",
  baseUrl: "https://api.bitso.com/v3/",
  requestPublic: function(endpoint, params = {}){
    //console.log(params)
    return axios.get(`${this.baseUrl}${endpoint}`, {params})
      .then(({data})=>data)
      .catch((err)=>console.log(err));
  },
  available_books: function(params = {}){
    return this.requestPublic('available_books/', params);
  },
  available_books: function(params = {}){
    return this.requestPublic('ticker/', params);
  },
  order_book: function(params = {book:'btc_mxn'}){
    return this.requestPublic('order_book/', params);
  },
  trades: function(params = {book:'btc_mxn'}){
    return this.requestPublic('trades/', params);
  },
  ticker: function(params = {book:'btc_mxn'}){
    return this.requestPublic('ticker/', params);
  },

  requestPrivate: function(endpoint, params, method, credentials){
    var secret = "";
    var apiKey = "";
    var baseUrl = this.baseUrl;
    if(credentials.key && credentials.secret){
      secret = credentials.secret;
      apiKey = credentials.key;
    } else {
      secret = this.secret;
      apiKey = this.api;
    }
    if(!usersRequests[apiKey]) usersRequests[apiKey] = [];
    return new Promise( function(resolve, refuse){
      usersRequests[apiKey].unshift(() => {
        var nonce = new Date().getTime();
        var json_payload = '';//params ? qs.stringify(params) : ""; // not working D:
        var request_path = `/v3/${endpoint}?` + qs.stringify(params);

        // Create the signature
        var Data = nonce + method.toLocaleUpperCase() + request_path + json_payload;
        var crypto = require('crypto');
        var signature = crypto.createHmac('sha256', secret).update(Data).digest('hex');
        var auth_header = "Bitso " + apiKey + ":" + nonce + ":" + signature;

        var config = {
          headers: {
            'Authorization': auth_header,
          },
        };
        var args =
          method === `get` ?
            [config] :
            [json_payload, config];
        //console.log(`${this.baseUrl}${endpoint}?` + qs.stringify(params), ...args);
        return axios[method](`${baseUrl}${endpoint}?` + qs.stringify(params), ...args)
          .then(({data})=>{
            usersRequests[apiKey].pop();
            if(usersRequests[apiKey].length) usersRequests[apiKey][usersRequests[apiKey].length-1]();
            //console.log(data);
            resolve(data)
          })
          .catch((err)=>{
            usersRequests[apiKey].pop();
            if(usersRequests[apiKey].length) usersRequests[apiKey][usersRequests[apiKey].length-1]();
            console.error(err.response.data);
            refuse(err)
          });
      });
      if(usersRequests[apiKey].length == 1){
        usersRequests[apiKey][usersRequests[apiKey].length-1]();
      }
    });
  }
};
