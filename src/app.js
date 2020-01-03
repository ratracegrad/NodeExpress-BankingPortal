const fs = require('fs');
const path = require('path');
const express = require('express');
const app = new express();

// set views and view engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Configure middleware
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));

// import json data and format it
const accountData = fs.readFileSync(path.join(process.cwd(), 'src/json/accounts.json'), 'utf8');
const accounts = JSON.parse(accountData);
const userData = fs.readFileSync(path.join(process.cwd(), 'src/json/users.json'), 'utf8');
const users = JSON.parse(userData);

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
    const from = req.body.from;
    const to = req.body.to;
    const amt = parseInt(req.body.amount);
    accounts[from].balance = accounts[from].balance - amt;
    accounts[to].balance = accounts[to].balance + amt;
    const accountsJSON = JSON.stringify(accounts);
    fs.writeFileSync(path.join(process.cwd(), 'src/json/accounts.json'), accountsJSON, 'utf8');
    res.render('transfer', { message: "Transfer Completed"})
});
app.get('/payment', (req, res) => {
    res.render('payment', { account: accounts.credit });
});
app.post('/payment', (req, res) => {
    const amt = parseInt(req.body.amount);
    accounts.credit.balance = accounts.credit.balance - amt;
    accounts.credit.available = accounts.credit.available + amt;
    const accountsJSON = JSON.stringify(accounts);
    fs.writeFileSync(path.join(process.cwd(), 'src/json/accounts.json'), accountsJSON, 'utf8');
    res.render('payment', { message: "Payment Successful", account: accounts.credit });
});

// Start the server
app.listen(3000, () => {
    console.log('PS Project Running on port 3000!');
});

