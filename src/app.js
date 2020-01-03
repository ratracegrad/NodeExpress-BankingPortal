const fs = require('fs');
const path = require('path');
const express = require('express');
const app = new express();
const { accounts, users, writeJSON } = require('./data.js');

// set views and view engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Configure middleware
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));

// setup routes
app.get('/', (req, res) => res.render('index',
    {
        title: 'Account Summary',
        accounts: accounts
    }
));
app.get('/savings', (req, res) => res.render('account',
    {
        account: accounts.savings
    }
));
app.get('/checking', (req, res) => res.render('account',
    {
        account: accounts.checking
    }
));
app.get('/credit', (req, res) => res.render('account',
    {
        account: accounts.credit
    }
));
app.get('/profile', (req, res) => res.render('profile',
    {
        user: users[0]
    }
));
app.get('/transfer', (req, res) => res.render('transfer'));
app.post('/transfer', (req, res) => {
    const amt = parseInt(req.body.amount, 10);
    accounts[req.body.from].balance -= amt;
    accounts[req.body.to].balance += amt;
    writeJSON();
    res.render('transfer', { message: "Transfer Completed"})
});
app.get('/payment', (req, res) => {
    res.render('payment', { account: accounts.credit });
});
app.post('/payment', (req, res) => {
    const amt = parseInt(req.body.amount, 10);
    accounts.credit.balance -= amt;
    accounts.credit.available += amt;
    writeJSON();
    res.render('payment', { message: "Payment Successful", account: accounts.credit });
});

// Start the server
app.listen(3000, () => {
    console.log('PS Project Running on port 3000!');
});

