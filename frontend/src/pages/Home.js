import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Spinner } from 'react-bootstrap';
import { Button, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

const URL = process.env.REACT_APP_SERVER_URL;

const Home = ({ account }) => {
	const [loading, setLoading] = useState(true);
	const [click, setClick] = useState([]);
	const [items, setItems] = useState([]);

	const loadMarketplaceItems = async () => {
		const items = await axios.get(`${URL}/marketplace/item-load`);
		setLoading(false);
		setItems(items.data);
	};

	const buyMarketItem = async (item, idx) => {
		try {
			// make button disable after click to avoid extra click
			setClick((prevState) => ({
				[idx]: !prevState[idx],
			}));

			const result = await axios.post(`${URL}/marketplace/buy-nft`, {
				item: item,
				account: account,
			});

			const resMsg = await result;
			alert(resMsg.data.msg);
		} catch (error) {
			const err = await error;
			alert(err.response.data.msg);
		}
		window.location.reload();
		loadMarketplaceItems();
	};

	useEffect(() => {
		loadMarketplaceItems();
	}, []);

	if (loading)
		return (
			<div className="item-flex">
				<Spinner animation="border" style={{ display: 'flex' }} />
				<p className="mx-3 my-0">Loading....</p>
			</div>
		);

	return (
		<div className="flex justify-center">
			{items.length > 0 ? (
				<div className="px-2 container">
					<Row xs={1} md={3} lg={5} className="g-3 py-5">
						{items.map((item, idx) => (
							<Col key={idx} className="overflow-hidden">
								<Card>
									<Card.Img variant="top" src={item.image} />
									<Card.Body color="secondary">
										<Card.Title>{item.name}</Card.Title>
										<Card.Text>
											{item.description.slice(0, 15)}....
										</Card.Text>
										<Card.Text>
											By:
											{item.seller.slice(0, 10) +
												'...' +
												item.seller.slice(35, 42)}
										</Card.Text>

										<Card.Text className="text-dark">
											<h5>
												<strong>
													Price:{' '}
													{ethers.utils.formatEther(
														item.totalPrice
													)}{' '}
													EYT
												</strong>
											</h5>
										</Card.Text>
									</Card.Body>

									<Card.Footer>
										<div className="d-grid">
											{item.seller.toUpperCase() ==
											account.toUpperCase() ? (
												<Button
													variant="info"
													size="lg"
													onClick={() =>
														alert('You Cant Buy Your Own NFT')
													}>
													Your Listed NFT
												</Button>
											) : (
												<Button
													onClick={() => buyMarketItem(item, idx)}
													variant="danger"
													size="lg"
													disabled={click[idx] ? true : false}>
													Buy
												</Button>
											)}
										</div>
									</Card.Footer>
								</Card>
							</Col>
						))}
					</Row>
				</div>
			) : (
				<main style={{ padding: '1rem 0' }}>
					<h2>No Listed assets</h2>
				</main>
			)}
		</div>
	);
};

export default Home;
