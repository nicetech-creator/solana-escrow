import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Account, Keypair, SystemProgram, Transaction, PublicKey } from '@solana/web3.js';
import React, { FC, useCallback } from 'react';

import {Wallet} from './components/wallet';
import logo from './logo.svg';
import './App.css';

const WPO_SPAN_SIZE = 41;
const WPO_PROGRAM_ID_STR = "DPCcrMDqFNH7vsHA1eUvwdgbAPhrW6LRNrNmy2kPWabd";
let WPO_STATE_ACCOUNT = "AckLqpkheahSWAMy7PSybUc3M6neSBQn6EdWx5ggwHEL";

function App() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  
  const onInitialize = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError();
    const WPO_PROGRAM_ID = new PublicKey(WPO_PROGRAM_ID_STR);
    const wpoAccount = new Account();

    const createWPOAccountIx = SystemProgram.createAccount({
      space: 41,
      lamports: await connection.getMinimumBalanceForRentExemption(41, 'singleGossip'),
      fromPubkey: publicKey,
      newAccountPubkey: wpoAccount.publicKey,
      programId: WPO_PROGRAM_ID
    });

    const tx = new Transaction()
      .add(createWPOAccountIx);
    
    const signature = await sendTransaction(tx, connection, {signers: [wpoAccount]});

    await connection.confirmTransaction(signature, 'processed');

    console.log('Future App Account address: ', wpoAccount.publicKey.toString());
  }, [publicKey, sendTransaction, connection]);

  return (
    <div className="App">
      <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow">
        <h5 className="my-0 mr-md-auto font-weight-normal">SOLANA_ESCROW</h5>
        <nav className="my-2 my-md-0 mr-md-3">
        </nav>
        <Wallet/>
      </div>

      <div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
        <h1 className="display-4">SOLANA ESCROW</h1>
        <p className="lead">Quickly interact with SOLANA ESCROW contract.</p>
      </div>

      <div className="container">

        
      </div>
      <footer className="pt-4 my-md-5 pt-md-5 border-top">
          <div className="row">
            <div className="col-12 col-md">
              <img className="mb-2" src="./logo.ico" alt="" width="24" height="24"/>
              <small className="d-block mb-3 text-muted">&copy; 2021</small>
            </div>
          </div>
        </footer>
    </div>
  );
}

export default App;
