import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import axios from 'axios';

import OwnerHistoryModel from '../components/OwnerHistoryModel';
const URL = process.env.REACT_APP_SERVER_URL;

const MyPurchases = ({ account }) => {
	const [loading, setLoading] = useState(true);
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [ownerHistData, setOwnerHistData] = useState([]);

	const [purchases, setPurchases] = useState([]);

	const loadPurchasedItems = async (account) => {
		const result = await axios.post(
			`${URL}/marketplace/user-purchased-item`,
			{
				account: account,
			}
		);
		setLoading(false);
		setPurchases(result.data);
	};

	useEffect(() => {
		loadPurchasedItems();
		// eslint-disable-next-line
	}, []);

	const handleRelisting = async (item, account) => {
		try {
			const result = await axios.post(`${URL}/marketplace/relist-nft`, {
				item: item,
				account: account,
			});
			const resMsg = await result;
			alert(resMsg.data.msg);
		} catch (error) {
			const err = await error;
			alert(err.response.data.msg);
		}
	};

	const ownerHistory = async (item, account) => {
		handleShow();

		try {
			const result = await axios.post(`${URL}/marketplace/ownerhistory`, {
				item: item,
				account: account,
			});
			console.log('OWNERSHIP HISTORY', result.data);
			setOwnerHistData(result.data);
		} catch (error) {
			const err = await error;
			alert(err.response.data.msg);
		}
	};

	if (loading)
		return (
			<div className="item-flex">
				<Spinner animation="border" style={{ display: 'flex' }} />
				<p className="mx-3 my-0">Loading....</p>
			</div>
		);

	return (
		<div className="flex justify-center">
			{purchases.length > 0 ? (
				<div className="px-5 container">
					<Row xs={1} md={2} lg={4} className="g-4 py-5">
						{purchases.map((item, idx) => (
							<Col key={idx} className="overflow-hidden">
								<Card bg="danger" border="danger">
									<Card.Img variant="top" src={item.image} />
									<Card.Body>
										<strong>
											{ethers.utils.formatEther(item.totalPrice)} EYT{' '}
										</strong>
									</Card.Body>
									<Card.Footer className="text-white d-flex justify-content-between">
										<Button
											variant="info"
											size="sm"
											onClick={() => ownerHistory(item, account)}>
											Owner History
										</Button>

										<Button
											variant="dark"
											size="sm"
											onClick={() => handleRelisting(item, account)}>
											Relist Item
										</Button>
									</Card.Footer>
								</Card>
							</Col>
						))}
					</Row>
				</div>
			) : (
				<main style={{ padding: '1rem 0' }}>
					<h2>NoT Purchased Any NFT's</h2>
				</main>
			)}

			<OwnerHistoryModel
				show={show}
				handleClose={handleClose}
				handleShow={handleShow}
				ownerHistoryData={ownerHistData}
			/>
		</div>
	);
};

export default MyPurchases;
