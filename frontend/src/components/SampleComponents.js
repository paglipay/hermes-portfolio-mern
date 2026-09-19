import React from 'react';
import { Button, Card, Alert, Form, Navbar, NavDropdown, Breadcrumb, Modal, ToastContainer, Toast } from 'react-bootstrap';

function SampleComponents() {
  const [show, setShow] = React.useState(false);

  return (
    <div>
      <h2>Bootstrap Component Samples</h2>
      <Alert variant="primary">This is a primary alert—check it out!</Alert>

      <Button variant="success" className="me-2">Success Button</Button>
      <Button variant="danger" onClick={() => setShow(true)}>Open Modal</Button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sample Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>This is a modal using React‑Bootstrap.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Card className="mt-3" style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the bulk of the card's content.
          </Card.Text>
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
      </Card>

      <Form className="mt-3" style={{ maxWidth: '400px' }}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">
            We'll never share your email.
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit">Submit</Button>
      </Form>

      <Breadcrumb className="mt-3">
        <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="#samples" active>Samples</Breadcrumb.Item>
      </Breadcrumb>

      <ToastContainer position="top-end" className="p-3">
        <Toast>
          <Toast.Header>
            <strong className="me-auto">Bootstrap Toast</strong>
          </Toast.Header>
          <Toast.Body>Hello, this is a toast!</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default SampleComponents;
