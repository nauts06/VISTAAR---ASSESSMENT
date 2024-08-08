import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function Transactions() {
  const { accountId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [checkedData, setCheckedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedPage, setCheckedPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [view, setView] = useState('transactions'); // Default view is 'transactions'


  const navigate = useNavigate()

  const handleSubmit = () => {
    axios.get(`http://localhost:5000/api/transactions/${accountId}`, { withCredentials: true })
      .then(response => {
        setTransactions(response.data.transactions);
        setView('transactions'); 
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    handleSubmit()
  }, [accountId])
  

  const handleCheck = () => {
    axios.get(`http://localhost:5000/api/low-transactions`, { withCredentials: true })
      .then(response => {
        setCheckedData(response.data);
        setView('checked'); // Set view to 'checked' when this button is clicked
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleAccountIdClick = (accountId) => {
    console.log('Account ID clicked:', accountId);

   

    navigate( `/product-list/${accountId}`)
    
  };
  

  // Pagination logic for main transactions table
  const indexOfLastTransaction = currentPage * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  // Pagination logic for checked data table
  const indexOfLastChecked = checkedPage * itemsPerPage;
  const indexOfFirstChecked = indexOfLastChecked - itemsPerPage;
  const currentCheckedData = checkedData.slice(indexOfFirstChecked, indexOfLastChecked);

  const nextTransactionsPage = () => {
    if (indexOfLastTransaction < transactions.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevTransactionsPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextCheckedPage = () => {
    if (indexOfLastChecked < checkedData.length) {
      setCheckedPage(checkedPage + 1);
    }
  };

  const prevCheckedPage = () => {
    if (checkedPage > 1) {
      setCheckedPage(checkedPage - 1);
    }
  };

  const handleProductAction = ()=>{
    navigate(-1);
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Transactions for Account {accountId}</h1>

     


<div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
  <div style={{ display: 'flex', gap: '10px' }}>
    
    <button
      onClick={handleSubmit}
      style={{
        padding: '10px 20px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      All Transactions
    </button>
    <button
      onClick={handleCheck}
      style={{
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      Transactions below 5000
    </button>
  </div>
  <button
     onClick={handleProductAction}
    style={{
      padding: '10px 20px',
      backgroundColor: '#dc3545',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    }}
  >
   Back 
  </button>
</div>




      {view === 'transactions'  ? (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Date</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Amount</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Transaction Code</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Symbol</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Price</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{transaction.amount}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{transaction.transaction_code}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{transaction.symbol.toUpperCase()}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{parseFloat(transaction.price).toFixed(2)}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{parseFloat(transaction.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls for Transactions */}
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={prevTransactionsPage}
              disabled={currentPage === 1}
              style={{
                padding: '10px',
                margin: '5px',
                backgroundColor: currentPage === 1 ? '#ccc' : '#007bff',
                color: currentPage === 1 ? '#777' : '#fff',
                border: '1px solid #ddd',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Previous
            </button>
            <button
              onClick={nextTransactionsPage}
              disabled={indexOfLastTransaction >= transactions.length}
              style={{
                padding: '10px',
                margin: '5px',
                backgroundColor: indexOfLastTransaction >= transactions.length ? '#ccc' : '#007bff',
                color: indexOfLastTransaction >= transactions.length ? '#777' : '#fff',
                border: '1px solid #ddd',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: '40px' }}>
        <h2>Transaction  Below 5000rs</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Account ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {currentCheckedData.map((data) => (
              <tr key={data._id}>
                
                <td
  style={{
    border: '1px solid #ddd',
    padding: '8px',
    cursor: 'pointer',
   
    color: '#007bff',            
    textDecoration: 'underline',  
  }}
  onClick={() => handleAccountIdClick(data.account_id)}
>
  {data.account_id}
</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{data.transactions[0].amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      
        {/* Pagination Controls for Checked Data */}
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={prevCheckedPage}
            disabled={checkedPage === 1}
            style={{
              padding: '10px',
              margin: '5px',
              backgroundColor: checkedPage === 1 ? '#ccc' : '#007bff',
              color: checkedPage === 1 ? '#777' : '#fff',
              border: '1px solid #ddd',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Previous
          </button>
          <button
            onClick={nextCheckedPage}
            disabled={indexOfLastChecked >= checkedData.length}
            style={{
              padding: '10px',
              margin: '5px',
              backgroundColor: indexOfLastChecked >= checkedData.length ? '#ccc' : '#007bff',
              color: indexOfLastChecked >= checkedData.length ? '#777' : '#fff',
              border: '1px solid #ddd',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Next
          </button>
        </div>
      </div>
      
      )}

      {/* {view === 'checked' && checkedData.length > 0 &&
       (
        <div style={{ marginTop: '40px' }}>
          <h2>Checked Data</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Account ID</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {currentCheckedData.map((data) => (
                <tr key={data._id}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{data.account_id}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{data.transactions[0].amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

       
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={prevCheckedPage}
              disabled={checkedPage === 1}
              style={{
                padding: '10px',
                margin: '5px',
                backgroundColor: checkedPage === 1 ? '#ccc' : '#007bff',
                color: checkedPage === 1 ? '#777' : '#fff',
                border: '1px solid #ddd',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Previous
            </button>
            <button
              onClick={nextCheckedPage}
              disabled={indexOfLastChecked >= checkedData.length}
              style={{
                padding: '10px',
                margin: '5px',
                backgroundColor: indexOfLastChecked >= checkedData.length ? '#ccc' : '#007bff',
                color: indexOfLastChecked >= checkedData.length ? '#777' : '#fff',
                border: '1px solid #ddd',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Next
            </button>
          </div>
        </div>
      )} */}

      {view === 'transactions' && currentTransactions.length === 0 && <p>No transactions available for this account.</p>}
      {view === 'checked' && checkedData.length === 0 && <p>No checked data available.</p>}
    </div>
  );
}

export default Transactions;
