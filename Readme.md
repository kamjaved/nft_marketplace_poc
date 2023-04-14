## PREREQUESITE TO RUN THE APP

Before you start this app you will need these tools already installed

1. Metamask
2. IPFS Desktop app
3. Ganache

#### Setup Ganache Test Network and Metamask Account

Open Metamask and Click on add Test Network and after that fill the given feild.

-  For New RPC URL: http://127.0.0.1:7545
-  Chain Id: 1337

More Info:- https://ethereum.stackexchange.com/questions/91072/setup-ganache-with-metamask-what-and-where-is-a-chain-id

##### After you set your test network open Ganache and Create a Workspace for your convinience otherwise you loose the porgress everytime you close the ganacge app or shut down your machine. and you need to add private key everytime before running the app.

Now Copy **Private Key** From any of the given account in Ganache and import this account in metamask. and `.env` file on backend directory as well. inside `PRIVATE_KEY_ACCOUNT` key.

#### Modify Config in IPFS otherwise you will face CORS issue while adding NFT. Modify Config in IPFS otherwise you will face CORS :tw-26a0: issue while adding NFT.

Open IPFS Desktop app and inside Setting tab you will find **IPFS CONFIG** Section paste the below code.

```json
"HTTPHeaders": {
			"Access-Control-Allow-Methods": [
				"PUT",
				"POST"
			],
			"Access-Control-Allow-Origin": [
				"*",
				"http://localhost:3000",
				"http://localhost:3001",
				"http://localhost:5000"
			]
		}
```

#### 3- How To Compile & Deploy Smart Contract in Remix IDE and Local Hardhat

#### :fa-check-circle: For Remix IDE

##### You need to deploy contract in the given order :

1. nft.sol
2. token.sol
3. marketplace.sol

###### AFTER THAT FOLLOW BELOW STEPS

-  Copy marketplace deployed contract address and go inside nft `setApprovalForAll` which ask for address and bool value paste copied marketplace address and true.

-  Then call mint function from same NFT contract where you need to provide IPFS IMAGE URL. to test on remix you can enter any random string. ex- PEN, FOO, BAR etc.

-  Now inside Marketplace contract call `makeItem` function it will ask 3 parameter. `nft_address`, `tokenId`,`pirce`;

#### :fa-check-circle: For Local Hardhat

-  find the path of deploy.js file In Our Case its present inside `backend/script/deploy.js`
   now run the below cmd

```javascript
npx hardhat run src/backend/scripts/deploy.js --network ganache
```

-  it will compile and deploy smartcontract in local Blockchain network (ganache). you will find 3 new folder artifacts, cache & contractsData
