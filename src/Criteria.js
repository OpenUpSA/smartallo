import React, { useEffect, useState } from "react";
import { Container, Row, Col, Navbar, Nav, Card, Dropdown, Table, Form } from 'react-bootstrap';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { useAppContext } from './AppContext';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Criteria() {

    const { criteria } = useAppContext();

    const [selectedCriteria, setSelectedCriteria] = useState("2020");

    const data = {
        labels: criteria?.filter(c => c.Year == selectedCriteria).map(item => item.Category),
        datasets: [
            {
                label: 'Categories',
                data: criteria.filter(c => c.Year == selectedCriteria).map(item => item.Percentage),
                backgroundColor: [

                    '#ff4164',
                    '#fb9b9c',
                    '#fbcdaf',
                    '#c8c8ab',
                    '#83af9b',
                    '#999',
                  ],
                
                borderWidth: 1,
            },
        ],
    };



    return (
        <>



            <Container fluid className="p-4">
                <Row className="mb-5">
                    <Col>
                        <h1><strong>SELECTION</strong> CRITERIA</h1>
                    </Col>
                    <Col xs="auto">
                        <Dropdown>
                            <Dropdown.Toggle size="lg" id="dropdown-basic">
                                {selectedCriteria}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => setSelectedCriteria("2020")}>2020</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setSelectedCriteria("2025")}>2025</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Card className="no-border">
                            <Card.Body>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Category</th>
                                            <th>Percentage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            criteria.filter(c => c.Year == selectedCriteria).map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.Category}</td>
                                                    <td>{item.Percentage}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="no-border">
                            <Card.Body>
                                <Doughnut data={data} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

            </Container>
        </>
    )

}