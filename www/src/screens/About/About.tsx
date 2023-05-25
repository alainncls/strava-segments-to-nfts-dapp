import React from 'react';
import { Container } from 'react-bootstrap';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const About = () => {
  return (
    <Container className="p-3">
      <Header hideButtons />
      <p> This app is developed by Alain Nicolas</p>
      {/*
        Application Description: Explain what your application is about and what it offers to users. Highlight the main features and unique advantages it provides.
        Purpose and Mission: Present the purpose of your application and the underlying mission. For example, if your application aims to promote physical activity by turning Strava performances into NFTs, explain how it contributes to promoting an active and healthy lifestyle.
        Team or Creators: Introduce the team or creators behind the application. Highlight their expertise, experience, and the motivation behind creating this application.
        How It Works: Provide an overview of how the application functions from a technical standpoint. You can explain the different steps, the integrations used (such as the Strava API), and how users can interact with the application.
        Privacy Policy: Make sure to include a mention of data privacy and how you handle user information. Explain how you respect privacy and how you use the data collected by the application.
        Contact: Provide contact information for users who wish to reach out to you with questions, feedback, or suggestions. This can include an email address or a contact form.
        Updates and News: If you have future development plans or upcoming updates for the application, you can mention them here to keep users informed.
        */}
      <Footer />
    </Container>
  );
};

export default About;
