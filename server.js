var auth    = require("./auth");
var express = require("express");
var app     = express();

app.use(auth.passport.initialize());
app.use(auth.passport.session());

app.get("/login", auth.passport.authenticate("provider", { successRedirect: "/" }));

app.get("/auth/azureoauth/callback",
    auth.passport.authenticate("provider", {
    successRedirect: "/",
    failureRedirect: "/login" }), function (req, res) { res.redirect("/"); });


var session = require("express-session");

app.use( session({
    secret: 'somesecret',
    resave: true,
    saveUninitialized : true
}));

app.set('port', process.env.PORT || 80);
var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});
