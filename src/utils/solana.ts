import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

// Initialize connection to Solana devnet
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

export const createNewAccount = async (): Promise<{ publicKey: string; secretKey: Uint8Array }> => {
  try {
    const newAccount = Keypair.generate();
    const airdropSignature = await connection.requestAirdrop(
      newAccount.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(airdropSignature);
    
    return {
      publicKey: newAccount.publicKey.toString(),
      secretKey: newAccount.secretKey
    };
  } catch (error) {
    console.error('Error creating new account:', error);
    throw error;
  }
};

export const transferSol = async (
  fromSecretKey: Uint8Array,
  toPublicKey: string,
  amount: number = 1
): Promise<string> => {
  try {
    const fromKeypair = Keypair.fromSecretKey(fromSecretKey);
    const toPublicKeyObj = new PublicKey(toPublicKey);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: toPublicKeyObj,
        lamports: amount * LAMPORTS_PER_SOL
      })
    );

    const signature = await connection.sendTransaction(transaction, [fromKeypair]);
    await connection.confirmTransaction(signature);
    
    return signature;
  } catch (error) {
    console.error('Error transferring SOL:', error);
    throw error;
  }
};