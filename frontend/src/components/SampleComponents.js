import React from 'react';
import {
  Accordion,
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  ProgressBar,
  Row,
  Table,
  Toast,
  ToastContainer,
} from 'react-bootstrap';

function SampleComponents() {
  const [showModal, setShowModal] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);

  return (
    <div className="showcase-page">
      <div className="mb-5">
        <Badge bg="primary" className="mb-3 px-3 py-2">Component library</Badge>
        <h1 className="display-6 fw-bold">Bootstrap building blocks</h1>
        <p className="lead text-secondary mb-0">A practical catalog of patterns ready to reuse in the portfolio.</p>
      </div>

      <Alert variant="primary" className="border-0 shadow-sm">
        <Alert.Heading className="h5">A useful alert</Alert.Heading>
        Bootstrap provides accessible, responsive primitives that can be composed into complete workflows.
      </Alert>

      <Row className="g-4 mt-1">
        <Col lg={7}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <Card.Title>Actions and feedback</Card.Title>
              <Card.Text className="text-secondary">Use clear actions with immediate confirmation.</Card.Text>
              <Button variant="primary" className="me-2" onClick={() => setShowToast(true)}>Show toast</Button>
              <Button variant="outline-secondary" onClick={() => setShowModal(true)}>Open modal</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={5}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <Card.Title>Progress</Card.Title>
              <Card.Text className="text-secondary">A compact status indicator for project work.</Card.Text>
              <ProgressBar now={72} label="72%" variant="success" />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mt-1">
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <Card.Title>Contact form</Card.Title>
              <Form onSubmit={(event) => event.preventDefault()}>
                <Form.Group className="mb-3" controlId="sampleName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control placeholder="Your name" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="sampleEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="name@example.com" />
                </Form.Group>
                <Button type="submit" variant="dark">Send message</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <Card.Title>Accordion</Card.Title>
              <Accordion flush>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>When should I use a card?</Accordion.Header>
                  <Accordion.Body>Cards work well for grouped, scannable content with a clear boundary.</Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>How do components stay responsive?</Accordion.Header>
                  <Accordion.Body>Bootstrap's grid and responsive utilities adapt layout across viewport sizes.</Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm mt-4">
        <Card.Body className="p-4">
          <Card.Title>Table and badges</Card.Title>
          <Table responsive hover className="align-middle mb-0">
            <thead>
              <tr><th>Pattern</th><th>Best for</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr><td>Navbar</td><td>Primary navigation</td><td><Badge bg="success">Ready</Badge></td></tr>
              <tr><td>Modal</td><td>Focused decisions</td><td><Badge bg="success">Ready</Badge></td></tr>
              <tr><td>Toast</td><td>Lightweight feedback</td><td><Badge bg="warning" text="dark">Review</Badge></td></tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Focused interaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>This modal demonstrates a focused confirmation flow without leaving the current page.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={() => setShowModal(false)}>Confirm</Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
          <Toast.Header><strong className="me-auto">Saved</strong></Toast.Header>
          <Toast.Body>Your action was completed successfully.</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default SampleComponents;
