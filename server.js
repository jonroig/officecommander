var auth    = require("./auth");
var express = require("express");
var app     = express();
var session = require("express-session");
var request = require("request");
var exphbs  = require('express-handlebars');

app.use( session({
    secret: 'somesecret',
    resave: true,
    saveUninitialized : true
}));

app.use(auth.passport.initialize());
app.use(auth.passport.session());

// protect our routes by sending unauthenticated users to the homepage
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// entry page...
app.get('/', function (req, res) {
    res.render('index');
});


// login
app.get("/login", auth.passport.authenticate("provider", { successRedirect: "/mail" }));


// stock oauth callback... handles the incoming requests from microsoft after you've authenticated
app.get("/auth/azureoauth/callback",
    auth.passport.authenticate("provider", {
    successRedirect: "/mail",
    failureRedirect: "/login" }), function (req, res) { res.redirect("/"); });


// example of a protected route
app.get('/mail', isAuthenticated, function (req, res, next) {

    // this is a rest request to the Graph API
    // it is VERY particular about how it wants those authorization headers
    // ... also, don't forget the "api-version=1.5" or it won't work.
    var opts = {
        url: 'https://graph.microsoft.com/beta/me/messages?api-version=1.5',
        headers : { 'authorization' : 'Bearer ' + req.user.accessToken }
    };
    request.get(
        opts,
        function (error, response, body) {
            if (error) {
                next(error);
            }
            else {
                console.log('mailbody',body);
                //res.send("<textarea>" + body + "</textarea>");

                var parsedBody = JSON.parse(body);
                console.log('body.value',parsedBody.value);
                res.render('mail', {emailArray: parsedBody.value});
            }
        }
    );
});


var server = app.listen(3000, function() {
    console.log('Express server listening on port 3000');
});


