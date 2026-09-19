import React, { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [previousResponseId, setPreviousResponseId] = useState(null);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function sendMessage(event) {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || sending) return;

    setMessages((current) => [...current, { role: 'user', text: trimmedMessage }]);
    setMessage('');
    setError('');
    setSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedMessage, previousResponseId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The chat request failed.');
      setPreviousResponseId(data.id);
      setMessages((current) => [...current, { role: 'assistant', text: data.reply }]);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col lg={9}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4 p-md-5">
              <div className="text-uppercase small text-primary fw-semibold mb-2">Hermes agent</div>
              <h1 className="display-6 fw-bold">Chat with Hermes</h1>
              <p className="lead text-secondary">Ask a question and keep the conversation going in one session.</p>
              <div className="chat-transcript border rounded p-3 mb-3" aria-live="polite">
                {messages.length === 0 && <p className="text-secondary mb-0">Your conversation will appear here.</p>}
                {messages.map((entry, index) => (
                  <div className={`chat-message chat-message-${entry.role} mb-3`} key={`${entry.role}-${index}`}>
                    <div className="small text-uppercase fw-semibold mb-1">{entry.role === 'user' ? 'You' : 'Hermes'}</div>
                    <div>{entry.text}</div>
                  </div>
                ))}
                {sending && <Spinner animation="border" size="sm" role="status" aria-label="Hermes is thinking" />}
              </div>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={sendMessage}>
                <Form.Group controlId="chatMessage">
                  <Form.Label>Message</Form.Label>
                  <Form.Control as="textarea" rows={3} maxLength={4000} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask Hermes something..." disabled={sending} />
                </Form.Group>
                <Button className="mt-3" type="submit" variant="primary" disabled={sending || !message.trim()}>
                  {sending ? 'Sending...' : 'Send message'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Chat;
