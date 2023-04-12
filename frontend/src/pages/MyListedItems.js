import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';
const URL = process.env.REACT_APP_SERVER_URL;

function renderSoldItems(items) {
	return (
		<>
			<h2>Sold</h2>
			<Row xs={1} md={3} lg={4} className="g-4 py-3">
				{items.map((item, idx) => (
					<Col key={idx} className="overflow-hidden">
						<Card bg="success" border="success">
							<Card.Img variant="top" src={item.image} />
							<Card.Footer className="text-white">
								<strong>
									{' '}
									Recieved {ethers.utils.formatEther(
										item.price
									)} EYT{' '}
								</strong>
							</Card.Footer>
						</Card>
					</Col>
				))}
			</Row>
		</>
	);
}

export default function MyListedItems({ account }) {
	const [loading, setLoading] = useState(true);
	const [listedItems, setListedItems] = useState([]);
	const [soldItems, setSoldItems] = useState([]);

	const loadListedItems = async (account) => {
		const result = await axios.post(`${URL}/marketplace/user-listed-item`, {
			account: account,
		});
		setLoading(false);
		setListedItems(result.data.listedItems);
		setSoldItems(result.data.soldItems);
	};

	useEffect(() => {
		loadListedItems(account);
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
			{listedItems.length > 0 ? (
				<div className="px-5 py-3 container">
					<h2>Listed</h2>
					<Row xs={1} md={2} lg={4} className="g-4 py-3">
						{listedItems.map((item, idx) => (
							<Col key={idx} className="overflow-hidden">
								<Card bg="info" border="info">
									<Card.Img
										variant="top"
										src={item.image}
										className="cardImage"
									/>
									<Card.Footer className="text-white">
										<strong>
											{' '}
											{ethers.utils.formatEther(
												item.totalPrice
											)} EYT{' '}
										</strong>
									</Card.Footer>
								</Card>
							</Col>
						))}
					</Row>

					{soldItems.length > 0 && renderSoldItems(soldItems)}
				</div>
			) : (
				<main style={{ padding: '1rem 0' }}>
					<h2>No Listed assets</h2>
				</main>
			)}
		</div>
	);
}
