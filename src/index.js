import React, { use, useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './AppContext';

import './app.scss';


import Sidebar from "./Sidebar.js";
import TopBar from "./Topbar.js";
import Dashboard from "./Dashboard.js";
import Criteria from "./Criteria.js";


export default function App() {
	
	


	

	return (
		<div style={{ display: 'flex', minHeight: '100vh' }}>
			<BrowserRouter>
				<AppProvider>			
				<Sidebar/>
				<div style={{ flex: 1 }}>
					<TopBar/>	
					<Routes>
						<Route path="/" element={<Dashboard/>} />
						<Route path="/criteria" element={<Criteria/>} />
					</Routes>
				</div>
			
			</AppProvider>
		</BrowserRouter>
			
		</div>
	);
}


const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);









