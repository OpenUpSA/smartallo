import { createContext, use, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Papa from "papaparse";


const AppContext = createContext();

export const AppProvider = ({ children }) => {

	const [criteria, setCriteria] = useState([]);

    const [beneficiaries, setBeneficiaries] = useState([]);
	
	const [municipalities, setMunicipalities] = useState([]);

	const [selectedMunicipality, setSelectedMunicipality] = useState(null);

	const [selectedCriteria, setSelectedCriteria] = useState("2020");

	const [pool, setPool] = useState([]);

	const [spaces, setSpaces] = useState(0);

	const colors = {
		Elderly: "#ff4164",
		Disabled: "#fb9b9c",
		Veteran: "#fbcdaf",
		hasClaim: "#c8c8ab",
		OldApplicant: "#83af9b",
		Discretionary: "#666"
	}

	useEffect(() => {
		fetch("./beneficiaries.csv")
			.then((res) => res.text())
			.then((text) => {
				Papa.parse(text, {
					header: true,
					skipEmptyLines: true,
					complete: (results) => {
						setBeneficiaries(results.data);
						setPool(results.data);
					},
				});
			});
		
		fetch("./municipalities.csv")
			.then((res) => res.text())
			.then((text) => {
				Papa.parse(text, {
					header: true,
					skipEmptyLines: true,
					complete: (results) => {
						setMunicipalities(results.data);
					},
				});
			});

		fetch("./criteria.csv")
			.then((res) => res.text())
			.then((text) => {
				Papa.parse(text, {
					header: true,
					skipEmptyLines: true,
					complete: (results) => {
						setCriteria(results.data);
					},
				});
			});
	}, []);

	useEffect(() => {
		if (spaces > 0 && selectedMunicipality !== null) {
			
			let selections = [];
	
			criteria.filter(c => c.Year == selectedCriteria).forEach((c) => {
				const label = c.Category;
				const count = Math.round(parseInt(spaces / 100 * c.Percentage || 0));
	
				if (label && count > 0) {
					const columnKey = label; 
	
					const filtered = beneficiaries.filter(b =>
						b[columnKey] === "1" && b.Allocated == "0" && b.Valid == "1" && b.Muni == selectedMunicipality
					);
	
					const sorted = filtered
						.map(b => ({ ...b, _rand: Math.random() }))
						.sort((a, b) => b.Score - a.Score || b._rand - a._rand)
						.slice(0, count);
	
					selections.push(...sorted);
				}
			});
	
			
			console.log("Selected Beneficiaries:", selections);
			setPool(selections); 
		}
	}, [spaces, selectedCriteria, selectedMunicipality]);
	

	useEffect(() => {
		if (selectedMunicipality !== null) {
			const filteredBeneficiaries = beneficiaries.filter((beneficiary) => beneficiary.Muni === selectedMunicipality);
			setPool(filteredBeneficiaries);
		} else {
			setPool(beneficiaries);
		}
	}, [selectedMunicipality]);



    return (
        <AppContext.Provider value={
            {
				colors,
				criteria,
				selectedCriteria,
				setSelectedCriteria,
                spaces,
                setSpaces,
                pool,
                setPool,
                municipalities,
                selectedMunicipality,
                setSelectedMunicipality
            }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);