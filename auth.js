"use strict";

/*jshint camelcase: false */

var AzureOAuth2Strategy  = require("passport-azure-oauth2");
var jwt                   = require("jwt-simple");

function AzureOAuthStrategy() {
    this.passport = require("passport");

    this.passport.use("ocommand", new AzureOAuth2Strategy({
      clientID: '873840b5-ab0a-468f-9fc4-74e4677997ad',
      clientSecret: 'hhhPRx0RuAke+QBVD7R+QcIoJuePc27mZhKdTQKo2FA=',
      callbackURL: 'http://officecommander.cloudapp.net/auth/azureoauth/callback/',
      resource: "https://graph.microsoft.com/",
      tenant: "7e6178cf-6e84-42ca-9206-5779585ec237",
      prompt: 'consent',
      state: true
    },
    function (accessToken, refreshtoken, params, profile, done) {
      var user = jwt.decode(params.id_token, "", true);
      console.log('user',user);
      done(null, user);
    }));

    this.passport.serializeUser(function(user, done) {
        console.log("serializeUser profile : ", user);
        done(null, user);
    });

    this.passport.deserializeUser(function(user, done) {
        console.log("deserializeUser profile : ", user);
        done(null, user);
    });
}

module.exports = new AzureOAuthStrategy();