import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import '../Login/styles.css';
import Api from "../../helpers/Api";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isRegisterPage = location.pathname === '/register';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await Api.loginApi(email, password);
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6} lg={4}>
            <div className="text-center mb-4">
              <img 
                src="/GymmatesLogo.png" 
                alt="GymmatesLogo" 
                width="151" 
                height="117" 
                className="img-fluid"
              />
              <h1>Gymmates</h1>
            </div>
            <div className="text-center mb-4">
              <Link to="/login">
                <CButton 
                  color={!isRegisterPage ? "success" : "secondary"} 
                  className="px-4 mx-2"
                  active={!isRegisterPage}
                  disabled={loading}
                >
                  Login
                </CButton>
              </Link>
              <Link to="/register">
                <CButton 
                  color={isRegisterPage ? "success" : "secondary"} 
                  className="px-4 mx-2"
                  active={isRegisterPage}
                  disabled={loading}
                >
                  Register
                </CButton>
              </Link>
            </div>
            {error && (
              <CAlert color="danger" className="mb-3">
                {error}
              </CAlert>
            )}
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>{isRegisterPage ? 'Register' : 'Login'}</h1>
                    <p className="text-body-secondary">
                      {isRegisterPage ? 'Create a new account' : 'Sign In to your account'}
                    </p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput 
                        placeholder="Email" 
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    {!isRegisterPage && (
                      <CRow>
                        <CCol xs={6}>
                          <CButton 
                            color="success" 
                            className="px-4"
                            type="submit"
                            disabled={loading}
                          >
                            {loading ? 'Loading...' : 'Login'}
                          </CButton>
                        </CCol>
                        <CCol xs={6} className="text-end">
                          <CButton color="link" className="px-0">
                            Forgot password?
                          </CButton>
                        </CCol>
                      </CRow>
                    )}
                    {isRegisterPage && (
                      <CButton 
                        color="success" 
                        className="w-100"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? 'Loading...' : 'Register'}
                      </CButton>
                    )}
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;