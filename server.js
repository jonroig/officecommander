var auth    = require("./auth");
var express = require("express");
var app     = express();
var session = require("express-session");

app.use( session({
    secret: 'somesecret',
    resave: true,
    saveUninitialized : true
}));

app.use(auth.passport.initialize());
app.use(auth.passport.session());

app.get("/login", auth.passport.authenticate("ocommand", { successRedirect: "/" }));

app.get("/auth/azureOAuth/callback",
    auth.passport.authenticate("ocommand", {
    successRedirect: "/",
    failureRedirect: "/login" }), function (req, res) { res.redirect("/"); });





app.set('port', process.env.PORT || 80);
var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});
