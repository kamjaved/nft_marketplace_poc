import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Modal } from 'react-bootstrap';

const TokenModal = ({ show, handleClose, account }) => {
	const [amount, setAmount] = useState(0);
	const onChangeHandler = (e) => {
		setAmount(e.target.value);
	};

	const handleTransferToken = async (e) => {
		e.preventDefault();
		if (!amount) return;
		const result = await axios.post(
			'http://localhost:3001/api/token/get-token-amount',
			{ amount: amount, account: account }
		);
		alert(result.data.msg);
		window.location.reload();
	};
	return (
		<>
			<Modal show={show} onHide={handleClose}>
				<Form onSubmit={(e) => handleTransferToken(e)}>
					<Modal.Header closeButton>
						<Modal.Title>Get Token</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						<Form.Group
							className="mb-3"
							controlId="exampleForm.ControlInput1">
							<Form.Label>Token Amount</Form.Label>
							<Form.Control
								value={amount}
								type="number"
								placeholder="500"
								autoFocus
								onChange={(e) => onChangeHandler(e)}
							/>
						</Form.Group>
					</Modal.Body>

					<Modal.Footer>
						<Button variant="primary" type="submit" onClick={handleClose}>
							Submit
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</>
	);
};

export default TokenModal;
