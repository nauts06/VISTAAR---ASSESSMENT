require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const cors = require('cors');
const { parse } = require('dotenv');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend origin
  credentials: true
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Express session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Note: secure should be true in production if using https
}));

// Passport configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Middleware
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('http://localhost:3000/customers');
  }
);

// Logout route
app.get('/auth/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie('connect.sid'); 
      res.status(200).send('Logged out successfully');
    });
  });
});

// Define your MongoDB schema and models
const customerSchema = new mongoose.Schema({
  name: String,
  address: String,
  accounts: [String]
});
const Customer = mongoose.model('Customer', customerSchema);

const accountSchema = new mongoose.Schema({
  customerId: mongoose.Schema.Types.ObjectId,
  name: String,
  transactions: [Number]
});
const Account = mongoose.model('Account', accountSchema);




const transactionSchema = new mongoose.Schema({
  account_id: Number,
  transaction_count: Number,
  bucket_start_date: Date,
  bucket_end_date: Date,
  transactions: [
    {
      date: Date,
      amount: Number,
      transaction_code: String,
      symbol: String,
      price: String,
      total: String
    }
  ]
});

const Transaction = mongoose.model('Transaction', transactionSchema);


const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  // Additional fields from your document example
  account_id: { type: Number },
  limit: { type: Number },
  products: [String]
});

const Product = mongoose.model('Product', productSchema);


app.get('/api/customers', (req, res) => {
  Customer.find({}).then(customers => res.json(customers));
});

app.get('/api/accounts/:customerId', (req, res) => {
  Account.find({ customerId: req.params.customerId }).then(accounts => res.json(accounts));
});

app.get('/api/transactions/:accountId', (req, res) => {
  console.log("req.params.accountId", req.params.accountId);
  
  Transaction.findOne({ account_id: parseInt(req.params["accountId"]) })
    .then(trans => {
      if (trans) {
        res.json(trans);
      } else {
        console.log("No transaction found for account_id:", req.params.accountId);
        res.status(404).json({ message: "Transaction not found" });
      }
    })
    .catch(err => {
      console.error("Database query error:", err);
      res.status(500).json({ error: err.message });
    });
});



// Mongo queries
// app.get('/api/low-transactions', (req, res) => {
//   Transaction.find({ transactions: {amount:{ $lte: 5000 }} }, { account_id: 1 }).then(accounts => res.json(accounts));
// });
app.get('/api/low-transactions', (req, res) => {
  Transaction.find(
    { transactions: { $elemMatch: { amount: { $lt: 5000 } } } }, 
    { account_id: 1, "transactions.$": 1 }
  )
  .then(accounts => res.json(accounts))
  .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/api/products/:accountId', async (req, res) => {
  try {
    // Fetch distinct product names
    // const distinctProductNames = await Product.distinct('name');
    
    // Fetch all products
    const allProducts = await Account.findOne({ account_id: parseInt(req.params["accountId"]) });
    
    // Send both responses in a single object
    res.json({
      // distinctProductNames,
      allProducts
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching products.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

