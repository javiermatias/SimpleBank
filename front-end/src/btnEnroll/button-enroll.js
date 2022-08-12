import { ethers } from "ethers";
import contract from "../contract/SimpleBankAbi.json";
import { useState } from "react";
import Spinner from "../spinner/spinner";
export default function ButtonEnroll({ stateEnroll }) {

    const contractAddress = "0x8DD130Cd016d322555f96C10861ed4d79A916337";
    const contractABI = contract.abi;
    const [spinner, setSpinner] = useState(false);

    const enroll = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert("Get MetaMask!");
                return;
            }

            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length !== 0) {
                const account = accounts[0];
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const simpleBankContract = new ethers.Contract(contractAddress, contractABI, signer);
                const enrollTxn = await simpleBankContract.enroll();
                setSpinner(true);
                console.log("Mining...", enrollTxn.hash);

                await enrollTxn.wait();
                console.log("Mined -- ", enrollTxn.hash);
                console.info("All Object -- ", enrollTxn);
                setSpinner(false);

                const check = await simpleBankContract.getEnroll(account);
                if (check) stateEnroll(true);

                console.log("The account is ", check);

            } else {
                console.log("No authorized account found");

            }


        } catch (error) {
            console.log(error);
            setSpinner(false);
        }
    }

    return (
        <div>

            {!spinner
                ? <button onClick={enroll}>Enroll</button>
                :
                <>
                    <Spinner></Spinner>
                    <p>Waiting for confirmation...</p>
                </>
            }
        </div>
    );
}