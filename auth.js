"use strict";

/*jshint camelcase: false */

var AzureOAuth2Strategy  = require("passport-azure-oauth2");
var jwt                   = require("jwt-simple");

function AzureOAuthStrategy() {
    this.passport = require("passport");

    this.passport.use("provider", new AzureOAuth2Strategy({
      clientID: '7d2eeb09-ffdf-4862-84c3-0c0db0d8a3aa',
      clientSecret: 'fWBhDwN8ZX1PZbfEzuVGCtKnSx/uSYJwikOTrvOFCJ4=',
      callbackURL: 'http://officecommander.cloudapp.net/auth/azureoauth/callback/',
      resource: "https://graph.microsoft.com/",
      prompt: 'consent'
    },
    function (accessToken, refreshtoken, params, profile, done) {
      var user = jwt.decode(params.id_token, "", true);
      console.log('user',user);
      done(null, user);
    }));

    this.passport.serializeUser(function(user, done) {
        console.log("serializeUserprofile : ", user);
        done(null, user);
    });

    this.passport.deserializeUser(function(user, done) {
        console.log("profile : ", user);
        done(null, user);
    });
}

module.exports = new AzureOAuthStrategy();