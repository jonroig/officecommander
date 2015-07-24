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

app.get('/', function (req, res) {
    res.send('Office 365 REST Mail Example: <a href="/login">login</a>');
});

app.get("/login", auth.passport.authenticate("provider", { successRedirect: "/mail" }));

app.get("/auth/azureoauth/callback",
    auth.passport.authenticate("provider", {
    successRedirect: "/mail",
    failureRedirect: "/login" }), function (req, res) { res.redirect("/"); });

app.get('/mail', function (req, res, next) {
	var opts = {
        url: 'https://graph.microsoft.com/beta/me/messages?api-version=1.5',
        headers : { 'authorization' : 'Bearer ' + req.user.accessToken }
    };
    console.log('opts',opts);
    require('request').get(
        opts,
        function (error, response, body) {
            if (error) {
                next(error);
            }
            else {
                console.log('mailbody',body);
                res.send("<textarea>" + body + "</textarea>");
            }
        }
    );
});


var server = app.listen(3000, function() {
    console.log('Express server listening on port 3000');
});
