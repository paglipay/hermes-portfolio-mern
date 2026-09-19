import React, { useContext } from 'react';
import { Navbar, Container, Nav, Form } from 'react-bootstrap';
import { ThemeContext } from '../context/ThemeContext';
import { Link, NavLink } from 'react-router-dom';

function NavBar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <Navbar bg={isDark ? 'dark' : 'light'} variant={isDark ? 'dark' : 'light'} expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Paul Aglipay</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/about">About</Nav.Link>
            <Nav.Link as={NavLink} to="/skills">Skills</Nav.Link>
            <Nav.Link as={NavLink} to="/community">Community</Nav.Link>
            <Nav.Link as={NavLink} to="/samples">Samples</Nav.Link>
          </Nav>
          <Form className="d-flex align-items-center">
            <Form.Check
              type="switch"
              id="dark-mode-switch"
              label={isDark ? 'Dark' : 'Light'}
              checked={isDark}
              onChange={toggleTheme}
            />
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
