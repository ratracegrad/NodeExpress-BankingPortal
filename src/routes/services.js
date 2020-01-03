const express = require('express');
const router = express.Router();

const { accounts, writeJSON } = require('../data.js');

router.get('/transfer', (req, res) => res.render('transfer'));
router.post('/transfer', (req, res) => {
    const amt = parseInt(req.body.amount, 10);
    accounts[req.body.from].balance -= amt;
    accounts[req.body.to].balance += amt;
    writeJSON();
    res.render('transfer', { message: "Transfer Completed"})
});
router.get('/payment', (req, res) => {
    res.render('payment', { account: accounts.credit });
});
router.post('/payment', (req, res) => {
    const amt = parseInt(req.body.amount, 10);
    accounts.credit.balance -= amt;
    accounts.credit.available += amt;
    writeJSON();
    res.render('payment', { message: "Payment Successful", account: accounts.credit });
});

module.exports = router;
