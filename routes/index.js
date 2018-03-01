const STRIPE_PUBLISHABLE_KEY = 'pk_test_OtUuMDA6UvEgCbHw7qWUgpBd';
const STRIPE_SECRET_KEY = 'sk_test_7dJrBjLLgm0FM7EXJgrqxBRD';

var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var stripe = require('stripe')(STRIPE_SECRET_KEY);
var path = require('path');
var User = require('../server/user');
var Post = require('../server/post');
var PdfDocument = require('pdfkit');

var homeSessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        return res.render('index', { title: 'SaveOnDev' });
    } else {
        return next();
    }    
};

router.get('/', homeSessionChecker, function(req, res) {
	res.redirect('/login');	
});

router.get('/login', function(req, res, next) {
	res.render('login', { title: 'SaveOnDev' });
});

router.post('/login', function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	
	User.find(username, password, function(user) {
		if (user == null) {
			res.redirect('/login');
		} else {
			req.session.user = user;
			res.redirect('/');
		}
	});
});

router.get('/logout', function(req, res, next) {
	if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

var sessionChecker = (req, res, next) => {
	console.log(req.session);
    if (req.session.user && req.cookies.user_sid) {
        return next();
    } else {
        res.redirect('/login');
    }    
};

router.get('/posts', sessionChecker, function(req, res, next) {
	var response = {
		status: 200,
		posts: [],
		message: null
	};

	Post.findAll(function(err, posts) {
		if (err) {
			response.status = 500;
			return res.json(response);
		}

		response.posts = posts;
		res.json(response);
	});
});

router.post('/postsInPdf', sessionChecker, function(req, res, next) {
	stripe.customers.create({
		email: req.body.stripeEmail,
		source: req.body.stripeToken
	})
  	.then(customer =>
    	stripe.charges.create({
      	amount,
      	description: "Sample Charge",
        currency: "usd",
        customer: customer.id
    }))
  	.then(charge => {
		var amount = 500;
  		var doc = new PdfDocument();
		var filename = req.body.filename;
		filename = encodeURIComponent(filename) + '.pdf';
		res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
	  	res.setHeader('Content-type', 'application/pdf');

	  	Post.findAll(function(err, posts) {
	  		var content = "Error";
			if (!err) {
				content = JSON.stringify(posts);
			}
			
			doc.y = 100;
		  	doc.text(content, 50, 50);
		  	doc.pipe(res);
		  	doc.end();
		});
  	});
});

module.exports = router;