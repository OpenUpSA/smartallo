import React, { useEffect, useState } from "react";
import { Container, Row, Col, Navbar, Nav, Card, Dropdown, Table, Form } from 'react-bootstrap';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShield, faPersonCane, faWheelchair, faPaperclip, faReceipt, faQuestion } from "@fortawesome/free-solid-svg-icons";

import { useAppContext } from './AppContext';

export default function Dashboard() {

	const { colors, criteria, spaces, setSpaces, selectedCriteria, setSelectedCriteria, municipalities, selectedMunicipality, setSelectedMunicipality, pool, setPool } = useAppContext();
	
	function countByField(field) {
		const count = pool.reduce((acc, item) => {
			if (parseInt(item[field]) === 1) {
				return acc + 1;
			}
			return acc;
		}, 0);
		return count;
	}

	function getCategoryPercentage(category) {
		const categoryData = criteria.find(c => c.Category === category && c.Name === selectedCriteria);
		return categoryData ? Math.floor(spaces / 100 * categoryData.Percentage) : 0;
	}

	function yesno(category, val) {
		return (
			val == "1" ? `bg-${category}-light` : ''
		)
	}

	useEffect(() => {
		if(selectedMunicipality == null) {
			setSpaces(0);
		}
	}, [selectedMunicipality])

	return (
		<>
			<Container fluid className="p-4">
				<Row className="mb-5">
                    <Col>
                        
                    </Col>
					<Col xs="auto">
						<Dropdown>
							<Dropdown.Toggle size="md" id="dropdown-basic">
								{selectedMunicipality ? municipalities.find(m => m.Muni == selectedMunicipality).Name : "Select Municipality"}
							</Dropdown.Toggle>

							<Dropdown.Menu>
								<Dropdown.Item onClick={() => setSelectedMunicipality(null)}>All</Dropdown.Item>
								{
									municipalities.map((municipality, index) => (
										<Dropdown.Item onClick={() => setSelectedMunicipality(municipality.Muni)} key={index}>
											{municipality.Name}
										</Dropdown.Item>
									))
								}
							</Dropdown.Menu>
						</Dropdown>
					</Col>

					<Col xs="auto">
						{
							selectedMunicipality != null &&
							<Form.Control size="md" type="text" placeholder="Spaces" onChange={(e) => setSpaces(e.target.value)} />
						}
					</Col>
					{
						selectedMunicipality != null && spaces > 0 && 
						<>
							
							<Col xs="auto">
								<Dropdown>
									<Dropdown.Toggle size="md" id="dropdown-basic">
										{selectedCriteria} Criteria
									</Dropdown.Toggle>

									<Dropdown.Menu>
										<Dropdown.Item onClick={() => setSelectedCriteria("2020")}>2020</Dropdown.Item>
										<Dropdown.Item onClick={() => setSelectedCriteria("2025")}>2025</Dropdown.Item>
										<Dropdown.Item onClick={() => setSelectedCriteria("Vets")}>Vets</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							</Col>
						</>
					}
                </Row>

				<Row className="mb-4">
					{/* <Col md={4} className="mb-4">
						<Card>
							<Card.Body>
								<Card.Title>Beneficiaries</Card.Title>
								<Card.Text>{pool.length}</Card.Text>
							</Card.Body>
						</Card>
					</Col> */}
					<Col md={4} className="mb-4">
						<Card className="category-elderly">
							<Card.Body>
								<Row>
									<Col xs={1}><FontAwesomeIcon icon={faPersonCane} className="text-elderly" size="2x"/></Col>
									<Col><h3 className="text-uppercase">Elderly</h3></Col>
								</Row>
								<Row className="mt-4">
									<Col xs={1}>
									</Col>
									<Col xs={3}>
										<strong>AVAILABLE</strong>
									</Col>
									<Col xs={3}>
										{countByField('Elderly')}
									</Col>
									{
										spaces > 0 && selectedMunicipality != null &&
										<>
											<Col xs={3}>
												<strong>REQUIRED</strong>
											</Col>
											<Col xs={2}>
												{ getCategoryPercentage('Elderly')}
											</Col>
										</>
									}
								</Row>
							</Card.Body>
						</Card>
					</Col>
					<Col md={4} className="mb-4">
						<Card className="category-disabled">
							<Card.Body>
								<Row>
									<Col xs={1}><FontAwesomeIcon icon={faWheelchair} className="text-disabled" size="2x"/></Col>
									<Col><h3 className="text-uppercase">Disabled</h3></Col>
								</Row>
								<Row className="mt-4">
									<Col xs={1}>
									</Col>
									<Col xs={3}>
										<strong>AVAILABLE</strong>
									</Col>
									<Col xs={3}>
										{countByField('Disabled')}
									</Col>
									{
										spaces > 0 && selectedMunicipality != null &&
										<>
											<Col xs={3}>
												<strong>REQUIRED</strong>
											</Col>
											<Col xs={2}>
												{ getCategoryPercentage('Disabled')}
											</Col>
										</>
									}
								</Row>
							</Card.Body>
						</Card>
					</Col>
					<Col md={4} className="mb-4">
						<Card className="category-veteran">
							<Card.Body>
								<Row>
									<Col xs={1}><FontAwesomeIcon icon={faShield} className="text-veteran" size="2x"/></Col>
									<Col><h3 className="text-uppercase">Veteran</h3></Col>
								</Row>
								<Row className="mt-4">
									<Col xs={1}>
									</Col>
									<Col xs={3}>
										<strong>AVAILABLE</strong>
									</Col>
									<Col xs={3}>
										{countByField('Veteran')}
									</Col>
									{
										spaces > 0 && selectedMunicipality != null &&
										<>
											<Col xs={3}>
												<strong>REQUIRED</strong>
											</Col>
											<Col xs={2}>
												{ getCategoryPercentage('Veteran')}
											</Col>
										</>
									}
								</Row>
							</Card.Body>
						</Card>
					</Col>
					<Col md={4} className="mb-4">
						<Card className="category-hasClaim">
							<Card.Body>
								<Row>
									<Col xs={1}><FontAwesomeIcon icon={faPaperclip} className="text-hasClaim" size="2x"/></Col>
									<Col><h3 className="text-uppercase">Has Claim</h3></Col>
								</Row>
								<Row className="mt-4">
									<Col xs={1}>
									</Col>
									<Col xs={3}>
										<strong>AVAILABLE</strong>
									</Col>
									<Col xs={3}>
										{countByField('HasClaim')}
									</Col>
									{
										spaces > 0 && selectedMunicipality != null &&
										<>
											<Col xs={3}>
												<strong>REQUIRED</strong>
											</Col>
											<Col xs={2}>
												{ getCategoryPercentage('HasClaim')}
											</Col>
										</>
									}
								</Row>
							</Card.Body>
						</Card>
					</Col>
					<Col md={4} className="mb-4">
						<Card className="category-oldApplicant">
							<Card.Body>
								<Row>
									<Col xs={1}><FontAwesomeIcon icon={faReceipt} className="text-oldApplicant" size="2x"/></Col>
									<Col><h3 className="text-uppercase">Old Applicant</h3></Col>
								</Row>
								<Row className="mt-4">
									<Col xs={1}>
									</Col>
									<Col xs={3}>
										<strong>AVAILABLE</strong>
									</Col>
									<Col xs={3}>
										{countByField('OldApplicant')}
									</Col>
									{
										spaces > 0 && selectedMunicipality != null &&
										<>
											<Col xs={3}>
												<strong>REQUIRED</strong>
											</Col>
											<Col xs={2}>
												{ getCategoryPercentage('OldApplicant')}
											</Col>
										</>
									}
								</Row>
							</Card.Body>
						</Card>
					</Col>
					{ spaces > 0 && selectedMunicipality != null &&
						<Col md={4} className="mb-4">
						<Card className="category-discretionary">
								<Card.Body>
									<Row>
										<Col xs={1}><FontAwesomeIcon icon={faQuestion} className="text-discretionary" size="2x"/></Col>
										<Col><h3 className="text-uppercase">Discretionary</h3></Col>
									</Row>
									<Row className="mt-4">
										<Col xs={1}>
										</Col>
										<Col xs={3}>
											<strong>AVAILABLE</strong>
										</Col>
										<Col xs={3}>
											{pool.length}
										</Col>
										{
										spaces > 0 && selectedMunicipality != null &&
										<>
											<Col xs={3}>
												<strong>REQUIRED</strong>
											</Col>
											<Col xs={2}>
												{ getCategoryPercentage('Discretionary')}
											</Col>
										</>
									}
									</Row>
								</Card.Body>
							</Card>
						</Col>
					}
				</Row>

				<Row className="mb-2">
					<Col></Col>
					<Col xs="auto">
						<Card>
							<Card.Body>
								<h3>{pool.length}</h3>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col>
						<Card className="no-border">
							<Card.Body>
								<Table className="beneficiaries-table">
									<thead>
										<tr>
											<th className="text-start">Muni</th>
											<th className="text-start">Name</th>
											<th className="text-start">Surname</th>
											<th className="text-start">ID Number</th>
											<th>Allocated</th>
											<th>Valid</th>
											<th>Elderly</th>
											<th>Disabled</th>
											<th>Veteran</th>
											<th>Has Claim</th>
											<th>Old Applicant</th>
											<th>Score</th>
										</tr>
									</thead>
									<tbody>
										{
											pool?.map((beneficiary, index) => (
												<tr key={index}>
													<td className="text-start">{beneficiary.Muni}</td>
													<td className="text-start">{beneficiary.Name}</td>
													<td className="text-start">{beneficiary.Surname}</td>
													<td className="text-start">{beneficiary['ID Number']}</td>
													<td>{beneficiary.Allocated}</td>
													<td>{beneficiary.Valid}</td>
													<td className={yesno('elderly',beneficiary.Elderly)}>{beneficiary.Elderly}</td>
													<td className={yesno('disabled',beneficiary.Disabled)}>{beneficiary.Disabled}</td>
													<td className={yesno('veteran',beneficiary.Veteran)}>{beneficiary.Veteran}</td>
													<td className={yesno('hasClaim',beneficiary.HasClaim)}>{beneficiary.HasClaim}</td>
													<td className={yesno('oldApplicant',beneficiary.OldApplicant)}>{beneficiary.OldApplicant}</td>
													<td>{beneficiary.Score}</td>
												</tr>
											))
										}
									</tbody>
								</Table>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				

			</Container>


		</>
	)

}