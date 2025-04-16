import React, { useEffect, useState } from "react";
import { Container, Row, Col, Navbar, Nav, Card, Dropdown, Table, Form } from 'react-bootstrap';

import ReactApexChart from 'react-apexcharts';

import { useAppContext } from './AppContext';



export default function Criteria() {

    const { criteria, colors } = useAppContext();

    const [selectedCriteria, setSelectedCriteria] = useState("2020");

    const [chartData, setChartData] = useState(null);

 

    useEffect(() => {

        console.log("criteria", criteria);

        setChartData(
            {


                series: criteria?.filter(c => c.Name == selectedCriteria).map(item => parseInt(item.Percentage)),
                
                options: {
                    chart: {
                        type: 'donut',
                    },
                    labels: criteria?.filter(c => c.Name == selectedCriteria).map(item => item.Category),
                    colors: Object.keys(colors).map(key => colors[key]),
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 200
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }]
                }
            }
        )

    }, [selectedCriteria]);






    return (
        <>



            <Container fluid className="p-4">
                <Row className="mb-5">
                    <Col>
                        <h1><strong>SELECTION</strong> CRITERIA</h1>
                    </Col>
                    <Col xs="auto">
                        <Dropdown>
                            <Dropdown.Toggle size="md" id="dropdown-basic">
                                {selectedCriteria}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setSelectedCriteria("2020")}>2020</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSelectedCriteria("2025")}>2025</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSelectedCriteria("Vets")}>Vets</Dropdown.Item>
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
                                            criteria.filter(c => c.Name == selectedCriteria).map((item, index) => (
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
                                {chartData && <ReactApexChart options={chartData.options} series={chartData.series} type="donut" /> }
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

            </Container>
        </>
    )

}