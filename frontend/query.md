# Module - BC Fundamentals:

Q What is a wallet address, what is a private key?

A: Wallet address is the address of EOA in metamask, My Ethereun Wallet (MEW) etc its also knows as public key. while the
private key is just like the password of an external
own account. its very confidential and can be used to make transaction, sign transaction and communicate contract with
your project directly without the interfare of wallet.

Q What is gas cost?

A: its is transaction fee cost which is paid to validators. gasprice: ( amount in gwei that user is willing to spent.more gas
faster the transaction)

`gaslimit:` 21000 minimum according to current value in future it may change .its like a cap

`gasCost = gasPrice\gasLimit*`

Q How do you "fund" an account?

A:

Q What is nonce?

A: nonce is the number of transaction sent to a blockchain network.Each time when we do a transaction, the nonce value
increased by one. Moreover, Nonce prevents replay-attack on Ethereum blockchain.

Q What is transaction hash?

A:Trasncation hash is key or say unique id of the transaction. it serves as proof of work that a new transaction block has
been created. its like a receipt.

Q What is chain id?
A: in metamask while adding any network like goerli, ganache, it ask for chian id .Etheruem network have two ID.

<li> 1- network id
<li> 2-  chain id both have similiar value but netwrok id used for peer to peer communication while chian id is used for signing a transactions.

<br>

# Module- Awareness of common tools/libraries:

Ganache - https://trufflesuite.com/ganache/
Truffle - https://trufflesuite.com/truffle/
Hardhat - https://hardhat.org/
Metamask - https://metamask.io/
Remix - https://remix.ethereum.org/
Openzeppelin contract Library- https://docs.openzeppelin.com/contracts/4.x/

<br>

# Module Development environment:

Q How do you a compile a contract, what is bytecode/ab1?

A: at first i use remix for writing contrat and deploying its has built in compiler. but for local system i used hardhat for
compiling & deploying the contract with ganache.

Q How do you write test cases for a contract?

Q How do you deploy a contract to chain?
A: use hardhat command to deploy contract in local network npx hardhat run --src/deploy.js --network network-name

ex: <br> `npx hardhat run src/backend/scripts/deploy.js --network ganache`

Q How do you call contract methods for read operations? (web3.js, ethers.js etc)

A: i have used ether js for communicating javascript project to blockchain netuork for read operation first of all we need a
provider we can get provider by below cmd

STEP-1 for frontend new ethers.provider. Web3Provider(link\_ url); & for nodejs new ethers.providers.JsonRpcProvider(LINK);

STEP-2 then create interface of contract new ethers.Contract(address, abi, provider);

<-!--IF YOU PERFORMING WRITE OPERATION THEN YOU WILL NEED SIGNER --->

STEP-2 const signer = provider.getSigner(account) // account is the public key or account address
STEP-3 new ethers.Contract(address, abi, signer);

after that you can call method of the conntracts
STEP-4 const callingMethod await contract.method()

<br>
# Module - Tokenization fundamentals:

Q Difference between fungible and nonfungible tokens
A: Fungible token are not unique in nature it can be divided and can act as a currency ex- doller,tokens etc.. while the other
hand nonFungible token are unique in nature and have only one owner at a time. ex paintings,domain-names, digital collecatbles

Q Where should we apply erc20 tokenization, where should we apply erc721?
A: when we have to deal with some exchanges with something in blockchain then we have to use ERC20 token while when we have to
list some unique items to sell or to buy then we can create an NFT of that. ex certficate issue for Some organistaion can be
done with ERC721

Q Fungible tokens (ERC20) - good understanding of atleast these methods: mint, transfer, burn, approve, balanceof?

A:
**mint:** it will create and List new tokens.

**transfer:** it wil ask 2 argument (`to,amount`) **to** is the address of the reciever and **amount** is the amount of token to be sent.

**burn:** this is security measure after some deadline the remaining token need to burn which this function does.

**approve:** this method called by owner to give access to another user to spent sone token. it have 2 argument (`spender,amount`) the address of the spender & the token amount.

**balanceOf:** this give the current token balance of account

Q Non-fungible tokens (ERC721) - good understanding of atleast these methods: mint, transfer, burn, approve, balanceOf

A:
**mint:** it will used to mine a new NFT

**trasnferFrom:** this function transfer nft Token to different owner its has 3 argument (`from,to,tokenId`)

**setApprovalForAll:** its will approve the address of the contract to use NFT for buy or sell

**approve:** it will give another user permission to transfer NFT. only one user at a time can get approved for the given TokenID. ex- `argument(to,tokenId)"`

<li> The ownership of the asset is transferred to the new user on successful ERC20 token transfer, this is one of the main
things we need.

<br>

# Flaws & Bugs

<li> Check & Deduct Token from Seller While Listing NFT
<li> Relisting Item Didn't have Price Input
