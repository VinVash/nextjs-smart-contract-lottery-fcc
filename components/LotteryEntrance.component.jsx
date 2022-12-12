import React, { useState, useEffect } from 'react';
import { useWeb3Contract, useMoralis } from "react-moralis";
import { ethers } from "ethers";;
import { useNotification } from "web3uikit";

import { abi, contractAddresses } from "../constants";

const LotteryEntrance = () => {

	const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
	const chainId = parseInt(chainIdHex);
	const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null;
	const [entranceFee, setEntranceFee] = useState("0");
	const [numPlayers, setNumPlayers] = useState("0");
	const [recentWinner, setRecentWinner] = useState("0");

	const dispatch = useNotification();

	const { runContractFunction: enterRaffle } = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress,
		functionName: "enterRaffle",
		params: {},
		msgValue: entranceFee,
	});

	const { runContractFunction: getEntranceFee } = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress,
		functionName: "getEntranceFee",
		params: {},
	});

	const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress,
		functionName: "getNumberOfPlayers",
		params: {},
	});

	const { runContractFunction: getRecentWinner } = useWeb3Contract({
		abi: abi,
		contractAddress: raffleAddress,
		functionName: "getRecentWinner",
		params: {},
	});

	async function updateUI() {
		const entranceFeeFromCall = (await getEntranceFee()).toString();
		const numPlayersFromCall = (await getNumberOfPlayers()).toString();
		const recentWinnerFromCall = await getRecentWinner();

		setEntranceFee(entranceFeeFromCall);
		setNumPlayers(numPlayersFromCall);
		setRecentWinner(recentWinnerFromCall);
	}

	// This useEffect is for updating in the first render.
	useEffect(() => {
		if(isWeb3Enabled) {
			// try to eat the raffle entrance fee.
			updateUI();
		}
	}, [isWeb3Enabled]);

	const handleSuccess = async function (tx) { // transaction is the input parameter.
		await tx.wait(1); // wait for the transaction to go through.
		handleNewNotification(tx);
		updateUI();
	}

	const handleNewNotification = function (tx) {
		dispatch({
			type: "info",
			message: "Transaction complete!",
			title: "Tx notification",
			position: "topR",
			icon: "bell",
		});
	}

    return (
        <div>
        	Hi from Lottery Entrance!

        	{raffleAddress ? (
				<div>
					<button onClick={async function() {
						// onSuccess checks to see if the transaction was successfully sent to Metamask.
						// in the function handleSuccess, we do tx.wait(1) because that is the piece that waits for the transaction to be confirmed.
						await enterRaffle({
							onSuccess: handleSuccess,
							onError: (error) => console.log(error),
						});
					}}>Enter Raffle</button>
					Entrance Fee: {entranceFee !== "" ? ethers.utils.formatUnits(entranceFee, "ether") : entranceFee } ETH
					<br />
					Number of Players: { numPlayers }
					<br />
					Recent Winner: { recentWinner }
				</div>
        	) : (
				<div>No Raffle Address detected!</div>
        	)}

        </div>
    );
};

export default LotteryEntrance;
