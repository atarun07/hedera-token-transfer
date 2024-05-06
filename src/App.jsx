import React, { useState } from "react";
import MyGroup from "./components/MyGroup.jsx";
import walletConnectFcn from "./components/hedera/walletConnect.js";
import tokenCreateFcn from "./components/hedera/tokenCreate.js";
import tokenMintFcn from "./components/hedera/tokenMint.js";
import topicMintFcn from "./components/hedera/topiccreate.js";
import contractDeployFcn from "./components/hedera/contractDeploy.js";
import contractDeployNFTFcn from "./components/hedera/deployNFTcontract.js";
import contractExecuteFcn from "./components/hedera/contractExecute.js";
import MirrorNodeClient  from "./components/hedera/mirrorNodeClient.js";

import "./styles/App.css";

function App() {
	const [walletData, setWalletData] = useState();
	const [accountId, setAccountId] = useState();
	const [tokenId, setTokenId] = useState();
	const [tokenSupply, setTokenSupply] = useState();
	const [contractId, setContractId] = useState();
	const [NFTcontractId, NFTsetContractId] = useState();

	const [connectTextSt, setConnectTextSt] = useState("🔌 Connect here...");
	const [NFTContractTextSt, setNFTContractTextSt] = useState("");
	const [createTextSt, setCreateTextSt] = useState("");
	const [mintTextSt, setMintTextSt] = useState("");
	const [mintTopicSt, setTopicTextSt] = useState("");
	const [contractTextSt, setContractTextSt] = useState();
	const [trasnferTextSt, setTransferTextSt] = useState();

	const [connectLinkSt, setConnectLinkSt] = useState("");
	const [createLinkSt, setCreateLinkSt] = useState("");
	const [mintLinkSt, setMintLinkSt] = useState("");
	const [topicLinkSt, settopicLinkSt] = useState("");
	const [contractLinkSt, setContractLinkSt] = useState();
	const [trasnferLinkSt, setTransferLinkSt] = useState();

	async function connectWallet() {
		if (accountId !== undefined) {
			setConnectTextSt(`🔌 Account ${accountId} already connected ⚡ ✅`);
		} else {
			const wData = await walletConnectFcn();
			wData[0].pairingEvent.once((pairingData) => {
				pairingData.accountIds.forEach((id) => {
					setAccountId(id);
					console.log(`- Paired account id: ${id}`);
					setConnectTextSt(`🔌 Account ${id} connected ⚡ ✅`);
					setConnectLinkSt(`https://hashscan.io/#/testnet/account/${id}`);
				});
			});
			setWalletData(wData);
			setCreateTextSt();
		}
	}

	async function contractDeployNFT() {
	console.log(`- hi`);	
	if (NFTcontractId !== undefined) {
		setNFTContractTextSt(`You already have deployed the contract ${NFTcontractId} ✅`);
	} else if (accountId === undefined) {
		setCreateTextSt(`🛑 Connect a wallet first! 🛑`);
	} else {
		console.log(`- hi`);
		const [NFTcontractId,txIdRaw] = await contractDeployNFTFcn(walletData, accountId);
		NFTsetContractId(NFTcontractId);
		console.log(`- Deployed Succesfully id: ${NFTcontractId}`);
		setNFTContractTextSt(`Successfully deployed NFT smart contract with ID: ${NFTcontractId} ✅`);
		}
	}


	async function tokenCreate() {
		if (tokenId !== undefined) {
			setCreateTextSt(`You already have token ${tokenId} ✅`);
		} else if (accountId === undefined) {
			setCreateTextSt(`🛑 Connect a wallet first! 🛑`);
		} else {
			const [tId, supply, txIdRaw] = await tokenCreateFcn(walletData, accountId);
			setTokenId(tId);
			setTokenSupply(supply);
			setCreateTextSt(`Successfully created token with ID: ${tId} ✅`);
			setMintTextSt();
			setContractTextSt();
			setTransferTextSt();
			const txId = prettify(txIdRaw);
			setCreateLinkSt(`https://hashscan.io/#/testnet/transaction/${txId}`);
		}
	}

	async function tokenMint() {
		if (tokenId === undefined) {
			setMintTextSt("🛑 Create a token first! 🛑");
		} else {
			const [supply, txIdRaw] = await tokenMintFcn(walletData, accountId, tokenId);
			setTokenSupply(supply);
			setMintTextSt(`Token Minted Succesfully with ID ${tokenId}! ✅`);
			const txId = prettify(txIdRaw);
			setMintLinkSt(`https://hashscan.io/#/testnet/transaction/${txId}`);
		}
	}
	// async function topicMint() {
	// 	if (tokenId === undefined) {
	// 		setTopicTextSt("🛑 Create a token first! 🛑");
	// 	} else {
	// 		const [topicId] = await topicMintFcn(walletData, accountId);
	// 		setTokenSupply(supply);
	// 		setTopicTextSt(`The newe topic ID is ${topicId}! ✅`);
	// 		const txId = prettify(txIdRaw);
	// 		settopicLinkSt(`https://hashscan.io/#/testnet/transaction/${txId}`);
	// 	}
	// }


	async function contractDeploy() {
		if (tokenId === undefined) {
			setContractTextSt("🛑 Create a token first! 🛑");
		} else if (contractId !== undefined) {
			setContractTextSt(`You already have contract ${contractId} ✅`);
		} else {
			const [cId, txIdRaw] = await contractDeployFcn(walletData, accountId, tokenId);
			setContractId(cId);
			setContractTextSt(`Successfully deployed smart contract with ID: ${cId} ✅`);
			setTransferTextSt();
			const txId = prettify(txIdRaw);
			setContractLinkSt(`https://hashscan.io/#/testnet/transaction/${txId}`);
		}
	}

	async function contractExecute() {
		if (tokenId === undefined || contractId === undefined) {
			setTransferTextSt("🛑 Create a token AND deploy a contract first! 🛑");
		} else {
			const txIdRaw = await contractExecuteFcn(walletData, accountId, tokenId, contractId);
			setTransferTextSt(`🎉🎉🎉 Great job! You completed the demo 🎉🎉🎉`);
			const txId = prettify(txIdRaw);
			setTransferLinkSt(`https://hashscan.io/#/testnet/transaction/${txId}`);
		}
	}

	function prettify(txIdRaw) {
		const a = txIdRaw.split("@");
		const b = a[1].split(".");
		return `${a[0]}-${b[0]}-${b[1]}`;
	}

	return (
		<div className="App">
			<h1 className="header">User Interface</h1>
			<MyGroup
				fcn={connectWallet}
				buttonLabel={"Connect Wallet"}
				text={connectTextSt}
				link={connectLinkSt}
			/>
		

			{/* <MyGroup
				fcn={contractDeployNFT}
				buttonLabel={"Deploy NFT Contract"}
				text={NFTContractTextSt}
				//link={createLinkSt}
			/> */}

			<MyGroup
				fcn={tokenCreate}
				buttonLabel={"Create New Cycle Token"}
				text={createTextSt}
				link={createLinkSt}
			/>

			<MyGroup
				fcn={tokenMint}
				buttonLabel={"Mint Cycle Token"}
				text={mintTextSt}
				link={mintLinkSt}
			/>

			{/* <MyGroup
				fcn={contractDeploy}
				buttonLabel={"Deploy Contract"}
				text={contractTextSt}
				link={contractLinkSt}
			/> */}

			<MyGroup
				fcn={contractExecute}
				buttonLabel={"Transfer Tokens"}
				text={trasnferTextSt}
				link={trasnferLinkSt}
			/>
			<div className="logo">
				<div className="symbol">
					<svg
						id="Layer_1"
						data-name="Layer 1"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 40 40"
					>
						<path d="M20 0a20 20 0 1 0 20 20A20 20 0 0 0 20 0" className="circle"></path>
						<path
							d="M28.13 28.65h-2.54v-5.4H14.41v5.4h-2.54V11.14h2.54v5.27h11.18v-5.27h2.54zm-13.6-7.42h11.18v-2.79H14.53z"
							className="h"
						></path>
					</svg>
				</div>
				<span>Hedera</span>
			</div>
		</div>
	);
}
export default App;
