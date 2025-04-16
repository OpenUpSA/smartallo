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
				.filter(c => c.Year == selectedCriteria && c.Category !== "Discretionary");
	
			// Step 1: Raw allocation
			let rawAllocations = filteredCriteria.map(c => ({
				label: c.Category,
				raw: (spaces * c.Percentage) / 100
			}));
	
			// Step 2: Round down, track remainders
			let total = 0;
			let allocations = rawAllocations.map(a => {
				const rounded = Math.floor(a.raw);
				total += rounded;
				return { ...a, count: rounded, remainder: a.raw - rounded };
			});
	
			// Step 3: Distribute remaining spaces
			let remainderSpaces = spaces - total;
			allocations
				.sort((a, b) => b.remainder - a.remainder)
				.slice(0, remainderSpaces)
				.forEach(a => a.count++);
	
			// Step 4: Select from each category
			let selections = [];
			let shortfall = 0;
			let leftovers = [];
	
			allocations.forEach(({ label, count }) => {
				const filtered = beneficiaries.filter(b =>
					b[label] === "1" &&
					b.Allocated === "0" &&
					b.Valid === "1" &&
					b.Muni === selectedMunicipality
				);
	
				const sorted = filtered
					.map(b => ({ ...b, _rand: Math.random() }))
					.sort((a, b) => b.Score - a.Score || b._rand - a._rand);
	
				const actual = sorted.slice(0, count);
				const remaining = sorted.slice(count); // extras for later
	
				selections.push(...actual);
	
				if (actual.length < count) {
					shortfall += (count - actual.length);
				} else {
					leftovers.push(...remaining); // store extras for fallback
				}
			});
	
			// Step 5: Fill shortfall from leftovers
			if (shortfall > 0) {
				const filler = leftovers
					.sort((a, b) => b.Score - a.Score || Math.random() - 0.5)
					.slice(0, shortfall);
				selections.push(...filler);
			}
	
			console.log("Final pool length:", selections.length, "/", spaces);
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