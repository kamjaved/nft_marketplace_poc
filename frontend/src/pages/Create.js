import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Form, Button } from 'react-bootstrap';
import { create } from 'ipfs-http-client';

import axios from 'axios';

const client = create('/ip4/127.0.0.1/tcp/5001');
console.log('IPFS CLIENT', client);
const URL = process.env.REACT_APP_SERVER_URL;
const IPFS_URL = process.env.REACT_APP_IPFS_URL;

const Create = ({ account }) => {
	const navigate = useNavigate();

	const [image, setImage] = useState('');
	const [price, setPrice] = useState(null);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');

	const uploadToIPFS = async (event) => {
		event.preventDefault();
		const file = event.target.files[0];
		console.log('FILE', file);

		if (typeof file !== 'undefined') {
			console.log('INSIDE IF');
			try {
				const result = await client.add(file);
				console.log({ result });
				setImage(`${IPFS_URL}/${result.path}`);
			} catch (error) {
				console.log('ipfs image upload error:', error);
			}
		}
	};

	const createNFT = async () => {
		if (!image || !price || !name || !description) return;
		try {
			const formData = {
				name: name,
				image: image,
				price: price,
				description: description,
				account: account,
			};
			const result = await axios.post(
				`${URL}/marketplace/create-mint-nft`,
				formData
			);
			const resMsg = await result;
			console.log({ resMsg }, 'RESULT', result);
			alert(resMsg.data.msg);

			navigate('/');
		} catch (error) {
			console.log('ipfs uri upload error:', error);
			alert(error.response.data.msg);
		}
	};

	return (
		<div className="container mt-5">
			<div className="row">
				<main
					role="main"
					className="col-lg-12 mx-auto"
					style={{ maxWidth: '500px' }}>
					<div className="content mx-auto">
						<Row className="g-4">
							<Form.Control
								type="file"
								required
								name="file"
								onChange={uploadToIPFS}
							/>

							<Form.Control
								onChange={(e) => setName(e.target.value)}
								size="lg"
								required
								type="text"
								placeholder="Name"
							/>

							<Form.Control
								onChange={(e) => setDescription(e.target.value)}
								size="lg"
								required
								as="textarea"
								placeholder="Description"
							/>

							<Form.Control
								onChange={(e) => setPrice(e.target.value)}
								size="lg"
								required
								type="number"
								placeholder="Price in EYT Token"
							/>

							<div className="d-grid px-0">
								<Button onClick={createNFT} variant="dark" size="lg">
									Create & List NFT!
								</Button>
							</div>
						</Row>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Create;
