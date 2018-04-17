var context = '';
if(bowser.mobile || bowser.tablet){
	context = 'https://'+location.hostname+'/';
}
var urlPrefix = context+'v-';
var tdcUrl = 'https://'+location.hostname+'/tdc/home.html';
var ctaUrl = 'https://'+location.hostname+'/taa/home.html';
var deskLoginUrl = '/mobileLogin'
var mobileLoginUrl = 'https://'+location.hostname+'/mobileLogin';
//var mobileHome = "index.html#/home";
var mobileHome = "/home";
var mobileLoginPage = "login.html";
var deskHome = "/home";
var deskLoginPage = "login";
var mobileVersion=2.0