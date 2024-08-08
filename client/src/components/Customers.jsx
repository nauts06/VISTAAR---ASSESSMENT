import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/customers', { withCredentials: true })
      .then(response => {
        setCustomers(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);



  // Inline styles
  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    heading: {
      fontSize: '24px',
      marginBottom: '20px',
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginBottom: '20px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      backgroundColor: '#f2f2f2',
      padding: '10px',
      border: '1px solid #ddd',
    },
    td: {
      padding: '10px',
      border: '1px solid #ddd',
    },
    link: {
      textDecoration: 'none',
      color: '#007bff',
    },
    linkHover: {
      textDecoration: 'underline',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Customers</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Address</th>
            <th style={styles.th}>Accounts</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer._id}>
              <td style={styles.td}>{customer.name}</td>
              <td style={styles.td}>{customer.address}</td>
              <td style={styles.td}>
              { console.log("account", customer)}
                {customer.accounts.map(account => (

                 
                  
                  <Link
                    key={account}
                    to={`/transactions/${account}`}
                    style={styles.link}
                    onMouseOver={(e) => e.target.style.textDecoration = styles.linkHover.textDecoration}
                    onMouseOut={(e) => e.target.style.textDecoration = styles.link.textDecoration}
                  >
                   
                    {account}
                  </Link>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Customers;
