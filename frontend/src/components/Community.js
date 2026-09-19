import React from 'react';
import { Alert, Button, Card, Col, Container, Row } from 'react-bootstrap';

function Community() {
  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col lg={9}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4 p-md-5">
              <div className="text-uppercase small text-primary fw-semibold mb-2">Community</div>
              <h1 className="display-6 fw-bold">Community Chat</h1>
              <p className="lead text-secondary">
                Join the conversation, ask questions, share feedback, or say hello.
              </p>
              <Alert variant="info" className="mb-4">
                The Discord widget will appear here once a Discord server ID is configured.
              </Alert>
              <Button href="https://discord.com" target="_blank" rel="noreferrer" variant="primary">
                Open Discord
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Community;
