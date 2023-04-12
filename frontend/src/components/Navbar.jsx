import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import TokenModal from './TokenModal';
import axios from 'axios';
import coin from '../assets/coin.png';
import logo from '../assets/logo.png';

const Navigation = ({ web3Handler, account }) => {
	const [show, setShow] = useState(false);
	const [tokenData, setTokenData] = useState({
		balance: null,
		symbol: '',
		owner: '',
	});

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const { balance, symbol } = tokenData;

	async function getTokenDetail() {
		const result = await axios.post(
			'http://localhost:3001/api/token/load-token-detail',
			{ account: account }
		);
		setTokenData({
			balance: result.data.balance,
			owner: result.data.owner,
			symbol: result.data.symbol,
		});
	}

	useEffect(() => {
		getTokenDetail();
	}, []);

	return (
		<Navbar expand="lg" bg="dark" variant="dark">
			<Container>
				<Navbar.Brand>
					<img src={logo} alt="logo" className="logo_brand" />
				</Navbar.Brand>

				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav id="me-auto" color="white">
						<Nav.Link as={Link} to="/">
							Home
						</Nav.Link>
						<Nav.Link as={Link} to="/create">
							Create NFT
						</Nav.Link>
						<Nav.Link as={Link} to="/my-listed-items">
							My NFTs
						</Nav.Link>
						<Nav.Link as={Link} to="/my-purchases">
							My Owned NFTs
						</Nav.Link>
					</Nav>
					<Nav>
						{account ? (
							<>
								<Nav.Link
									target="_blank"
									rel="noopener noreferrer"
									className="button nav-button btn-sm mx-4">
									<Button variant="outline-light">
										{account.slice(0, 5) +
											'....' +
											account.slice(38, 42)}
									</Button>
								</Nav.Link>

								<Nav.Link onClick={handleShow}>
									<img src={coin} alt="coin" className="coin_icon" />
									<span className="text-bold">
										{balance} {symbol}
									</span>
								</Nav.Link>

								<TokenModal
									show={show}
									handleClose={handleClose}
									handleShow={handleShow}
									account={account}
								/>
							</>
						) : (
							<Button onClick={web3Handler} variant="outline-light">
								{' '}
								Connect Wallet
							</Button>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default Navigation;
