import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Customers from './components/Customers';
import Transactions from './components/Transactions';
import ProductList from './components/ProductList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/transactions/:accountId" element={<Transactions />} />
        <Route path="/product-list/:accountId" element={<ProductList />} />
      </Routes>
    </Router>
  );
}

export default App;
