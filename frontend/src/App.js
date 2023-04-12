import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Create from './pages/Create';
import MyListedItem from './pages/MyListedItems';
import MyPurchases from './pages/MyPurchases';

import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';

import './App.css';

function App() {
	const [account, setAccount] = useState(null);
	const [loading, setLoading] = useState(true);

	// Metamask Login/Connect

	const web3Handler = async () => {
		const accounts = await window.ethereum.request({
			method: 'eth_requestAccounts',
		});
		setAccount(accounts[0]);

		window.ethereum.on('accountChnaged', async function (accounts) {
			setAccount(accounts[0]);
			setLoading(true);
			await web3Handler();
		});

		setLoading(false);
	};

	useEffect(() => {
		web3Handler();
	}, []);

	return (
		<div className="App">
			<div>
				{loading ? (
					<div className="item-flex">
						<Spinner animation="border" style={{ display: 'felx' }} />
						<p className="mx-3 my-0">Awaiting Metamask Connection...</p>
					</div>
				) : (
					<>
						<Navbar web3Handler={web3Handler} account={account} />
						<Routes>
							<Route path="/" element={<Home account={account} />} />
							<Route
								path="/create"
								element={<Create account={account} />}
							/>

							<Route
								path="/my-listed-items"
								element={<MyListedItem account={account} />}
							/>
							<Route
								path="/my-purchases"
								element={<MyPurchases account={account} />}
							/>
						</Routes>
					</>
				)}
			</div>
		</div>
	);
}

export default App;
