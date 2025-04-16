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
			const filteredCriteria = criteria
				.filter(c => c.Name == selectedCriteria && c.Category !== "Discretionary");
	
			let rawAllocations = filteredCriteria.map(c => ({
				label: c.Category,
				count: (spaces * c.Percentage) / 100
			}));
	
			let selections = [];
			let usedIDs = new Set();
			let shortfall = 0;
	
			rawAllocations.forEach(({ label, count }) => {
				const intCount = Math.floor(count);
	
				const filtered = beneficiaries.filter(b =>
					!usedIDs.has(b['ID Number']) &&
					b[label] === "1" &&
					b.Allocated === "0" &&
					b.Valid === "1" &&
					b.Muni === selectedMunicipality
				);
	
				const sorted = filtered
					.map(b => ({ ...b, _rand: Math.random() }))
					.sort((a, b) => b.Score - a.Score || b._rand - a._rand);
	
				const actual = sorted.slice(0, intCount);
	
				console.log(`${label}: required=${intCount}, available=${filtered.length}, selected=${actual.length}`);
	
				actual.forEach(b => usedIDs.add(b['ID Number']));
				selections.push(...actual);
	
				if (actual.length < intCount) {
					shortfall += intCount - actual.length;
				}
			});
	
			console.log("Final total selected:", selections.length, "Shortfall:", shortfall, "Expected:", spaces);
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