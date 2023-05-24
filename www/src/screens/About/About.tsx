import React from 'react';
import { Container } from 'react-bootstrap';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const About = () => {
  return (
    <Container className="p-3">
      <Header />
      <p> This app is developed by Alain Nicolas</p>
      <Footer />
    </Container>
  );
};

export default About;
