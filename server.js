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

app.get("/login", auth.passport.authenticate("provider", { successRedirect: "/" }));

app.get("/auth/azureoauth/callback",
    auth.passport.authenticate("provider", {
    successRedirect: "/",
    failureRedirect: "/login" }), function (req, res) { res.redirect("/"); });

app.get('/mail', function (req, res, next) {
	console.log('req.session')
    var opts = {
        url: 'https://graph.microsoft.com/beta/me/messages',
        headers : { 'Authorization' : 'Bearer: ' + req.session.user.accessToken }
    };
    console.log('opts',opts);
    request.get(
        opts,
        function (error, response, body) {
            if (error) {
                next(error);
            }
            else {
                console.log('mailbody',body);
                data = { user: passport.user, msgs: JSON.parse(body)['value'] };
                res.render('mail', { data: data });
            }
        }
    );
});


app.set('port', process.env.PORT || 80);
var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});
