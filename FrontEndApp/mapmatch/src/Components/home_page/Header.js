
import './App.css';
import Button from '@mui/material/Button';
import NavBar from './IndexNaBar';
import React from "react";
import { Container } from 'reactstrap';
import { Link } from 'react-router-dom';

function IndexHeader() {
  return (
    <div
      className="page-header section-dark"
      style={{
        backgroundImage: "url(./b)",
      }}
    >
      <div className="filter" />
      <div className="content-center">
        <Container>
          <NavBar />
          <div className="title-brand">
            <h1 className="presentation-title">MapMatch</h1>
          </div>
          <h2 className="presentation-subtitle text-center">
            Find new friends, connect with people and enjoy a good time in the real world!
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link
              // component={Link}
              to="/register"
              style={{ borderColor: '#ffffff', color: '#ffffff' }}
              className="SignUp"
              // variant="outlined"
            >
              SignUp
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default IndexHeader;




