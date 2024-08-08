import React from 'react';

function Login() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f2f5',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      fontSize: '2em',
      marginBottom: '20px',
      color: '#333'
    },
    button: {
      padding: '10px 20px',
      fontSize: '1em',
      color: '#fff',
      backgroundColor: '#4285F4',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
    },
    buttonHover: {
      backgroundColor: '#357ae8'
    }
  };

  return (
    <div style={styles.container}>
      <h2>Vistaar Digital Communications Pvt. Ltd.</h2>
      <h1 style={styles.title}>Login</h1>
      <button 
        style={styles.button} 
        onClick={handleLogin}
        onMouseOver={e => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
        onMouseOut={e => e.target.style.backgroundColor = styles.button.backgroundColor}
      >
        Login with Google
      </button>
    </div>
  );
}

export default Login;
