import React from 'react';
import { Container, Card } from 'react-bootstrap';

const Privacy = () => {
  return (
    <Container className="py-5">
      <h1 className="mb-4">Privacy Policy</h1>
      
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Introduction</Card.Title>
          <Card.Text>
            Welcome to the Movie Recommendation App. We respect your privacy and are committed to protecting your personal data.
            This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </Card.Text>
        </Card.Body>
      </Card>
      
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>The Data We Collect About You</Card.Title>
          <Card.Text>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
          </Card.Text>
          <ul>
            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier, and gender.</li>
            <li><strong>Contact Data</strong> includes email address, phone number, and address.</li>
            <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong>Profile Data</strong> includes your username and password, your interests, preferences, feedback, and survey responses.</li>
            <li><strong>Usage Data</strong> includes information about how you use our website, products, and services, including movie ratings and preferences.</li>
          </ul>
        </Card.Body>
      </Card>
      
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>How We Use Your Personal Data</Card.Title>
          <Card.Text>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </Card.Text>
          <ul>
            <li>To register you as a new customer.</li>
            <li>To provide personalized movie recommendations based on your ratings and preferences.</li>
            <li>To manage our relationship with you.</li>
            <li>To improve our website, products/services, marketing, and customer relationships.</li>
            <li>To administer and protect our business and this website.</li>
          </ul>
        </Card.Body>
      </Card>
      
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Data Security</Card.Title>
          <Card.Text>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.
            In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
            They will only process your personal data on our instructions, and they are subject to a duty of confidentiality.
          </Card.Text>
        </Card.Body>
      </Card>
      
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Your Legal Rights</Card.Title>
          <Card.Text>
            Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
          </Card.Text>
          <ul>
            <li>Request access to your personal data.</li>
            <li>Request correction of your personal data.</li>
            <li>Request erasure of your personal data.</li>
            <li>Object to processing of your personal data.</li>
            <li>Request restriction of processing your personal data.</li>
            <li>Request transfer of your personal data.</li>
            <li>Right to withdraw consent.</li>
          </ul>
        </Card.Body>
      </Card>
      
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Changes to the Privacy Policy</Card.Title>
          <Card.Text>
            We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.
            You are advised to review this privacy policy periodically for any changes. Changes to this privacy policy are effective when they are posted on this page.
          </Card.Text>
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Body>
          <Card.Title>Contact Us</Card.Title>
          <Card.Text>
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
          </Card.Text>
          <address>
            <strong>Movie Recommendation App</strong><br />
            Email: privacy@movierecommendation.com<br />
            Phone: +1 (555) 123-4567<br />
            Address: 123 Movie Street, Hollywood, CA 90001, USA
          </address>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Privacy;
