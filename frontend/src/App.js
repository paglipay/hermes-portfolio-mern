import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Badge, Button, Card, Col, Container, Nav, Navbar, Row } from 'react-bootstrap';
import About from './components/About';
import Skills from './components/Skills';
import SampleComponents from './components/SampleComponents';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function Home() {
  return (
    <>
      <section className="hero-section rounded-4 p-4 p-md-5 mb-5">
        <Row className="align-items-center g-4">
          <Col lg={8}>
            <Badge bg="light" text="dark" className="mb-3 px-3 py-2">Network and Software Engineer</Badge>
            <h1 className="display-4 fw-bold">Building dependable systems and useful software.</h1>
            <p className="lead mb-4">
              A Bootstrap-powered portfolio for infrastructure, device inventory, and full-stack work.
            </p>
            <Button as={Link} to="/about" variant="light" size="lg" className="me-2">Explore the portfolio</Button>
            <Button as={Link} to="/samples" variant="outline-light" size="lg">View Bootstrap samples</Button>
          </Col>
          <Col lg={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="small text-uppercase text-secondary fw-semibold mb-2">Current focus</div>
                <h2 className="h4">Clear tools for complex work</h2>
                <p className="text-secondary mb-0">Practical interfaces, resilient infrastructure, and maintainable code.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
      <Row className="g-4">
        {[
          ['Infrastructure', 'Reliable networks, devices, and operational workflows.'],
          ['Full-stack development', 'Thoughtful React experiences backed by focused APIs.'],
          ['Design systems', 'Reusable Bootstrap components that keep products coherent.'],
        ].map(([title, text]) => (
          <Col md={4} key={title}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <Card.Title>{title}</Card.Title>
                <Card.Text className="text-secondary">{text}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}

function App() {
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold">Paul Aglipay</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/about">About</Nav.Link>
              <Nav.Link as={Link} to="/skills">Skills</Nav.Link>
              <Nav.Link as={Link} to="/samples">Samples</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main className="py-5">
        <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/samples" element={<SampleComponents />} />
          <Route path="*" element={<Home />} />
        </Routes>
        </Container>
      </main>
      <footer className="border-top py-4 text-center text-secondary small">
        <Container>Built with React Bootstrap and a bias toward useful interfaces.</Container>
      </footer>
    </Router>
  );
}

export default App;

