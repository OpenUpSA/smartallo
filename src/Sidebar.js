import React, { useEffect, useState } from "react";
import { Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


export default function Sidebar() {

    const navigate = useNavigate();

    return (

        <div className="sidebar">
            <div className="p-3">
                <h4><strong>SMART</strong>ALLO</h4>
                <hr/>
                <Nav className="flex-column">
                    <Nav.Link onClick={() => navigate('/')} className="text-light">Dashboard</Nav.Link>
                    <Nav.Link onClick={() => navigate('/criteria')} href="#" className="text-light">Criteria</Nav.Link>
                    <Nav.Link onClick={() => navigate('/check')} href="#" className="text-light">Check</Nav.Link>
                </Nav>
            </div>
        </div>
        
            
    )

}