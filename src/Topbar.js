import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Topbar() {

    const navigate = useNavigate();

    return (

        <Navbar bg="primary">
            <Container fluid>
			<Navbar.Brand href="#"><h1><strong>SMART</strong>ALLO</h1></Navbar.Brand>
            <Nav>
                <Nav.Link onClick={() => navigate('/')} className="text-light">Dashboard</Nav.Link>
                <Nav.Link onClick={() => navigate('/criteria')} href="#" className="text-light">Criteria</Nav.Link>
                <Nav.Link onClick={() => navigate('/check')} href="#" className="text-light">Check</Nav.Link>
            </Nav>
            </Container>
        </Navbar>


        
    )
}
