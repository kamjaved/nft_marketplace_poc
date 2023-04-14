import React from 'react';
import { Modal } from 'react-bootstrap';

const OwnerHistoryModel = ({ show, handleClose, ownerHistoryData }) => {
	return (
		<>
			<Modal
				show={show}
				onHide={handleClose}
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
				centered>
				<Modal.Header closeButton>
					<Modal.Title>NFT Ownership History </Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{ownerHistoryData.map((item) => (
						<p>
							◾ <strong>Owner:</strong>
							{item.owner}
							{'---->'}
							<span>
								{item.userAction === 'List' ? '🟢 List' : '🔴 Buy'}
							</span>
						</p>
					))}
				</Modal.Body>
			</Modal>
		</>
	);
};

export default OwnerHistoryModel;
