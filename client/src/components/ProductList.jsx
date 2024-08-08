// ProductList.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProductList = () => {
  const { accountId } = useParams();
  const [productData, setProductData] = useState({});

  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${accountId}`, { withCredentials: true })
      .then((response) => {
        setProductData(response.data.allProducts);
        console.log("response", response.data.allProducts);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [accountId]);

  const { account_id, limit, products } = productData;

  const handleProductAction = ()=>{
    navigate(-1);
  }
  return (
    <div style={{ margin: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Product Details</h2>
    
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
  <div style={{ display: 'flex', gap: '10px' }}>
    
  
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
    
    
    
    
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
      }}>
        <thead>
          <tr>
            <th style={{
              border: '1px solid #ddd',
              padding: '12px',
              backgroundColor: '#007bff',
              color: '#fff',
              textAlign: 'left'
            }}>Account ID</th>
            <th style={{
              border: '1px solid #ddd',
              padding: '12px',
              backgroundColor: '#007bff',
              color: '#fff',
              textAlign: 'left'
            }}>Limit</th>
            <th style={{
              border: '1px solid #ddd',
              padding: '12px',
              backgroundColor: '#007bff',
              color: '#fff',
              textAlign: 'left'
            }}>Products</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '12px' }}>{account_id}</td>
            <td style={{ border: '1px solid #ddd', padding: '12px' }}>{limit}</td>
            <td style={{ border: '1px solid #ddd', padding: '12px' }}>
              <ul style={{ listStyleType: 'none', padding: '0' }}>
                {products?.map((product, index) => (
                  <li key={index} style={{ padding: '4px 0', borderBottom: '1px solid #eee' }}>
                    {product}
                  </li>
                ))}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
