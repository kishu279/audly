import { Frequency } from "./../lib/types";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";

// contract interaction
import { Auddly } from "../contract/auddly";
import idl from "../contract/auddly.json";

// const programId = new Keypair.PublicKey(
//   "3PFune4jW6WKBJYZm2HLVs6VkkazdgAdzK5ZjgpAX5Rn",
// );

// devnet cluster URL for Solana
const clusterUrl = "https://api.devnet.solana.com";

const connection = new Connection(clusterUrl);
const wallet = useAnchorWallet();

const provider = new AnchorProvider(connection, wallet!, {
  commitment: "confirmed",
});

const program = new Program<Auddly>(idl as Auddly, provider);

if (!provider.wallet.publicKey) {
  console.error("Wallet not connected");
  throw new Error("Wallet not connected");
}

/// TODO: implement contract interaction functions here

/// Company Admin Initializes
export async function initializePayroll(
  totalAmount: number,
  frequency: Frequency,
  symbol: string,
  mintAddress: string,
) {
  let mintAddressPubkey = new PublicKey(mintAddress);

  try {
    const response = await program.methods
      .initializePayroll(totalAmount, frequency, symbol)
      .accountsPartial({
        mint: mintAddressPubkey,
        authority: provider.wallet.publicKey,
      })
      .rpc();

    if (response) {
      // return or toast a success message to the user
      console.log("Payroll initialized successfully:", response);
    } else {
      console.log("Failed to initialize payroll: No response from contract");
    }
  } catch (error) {
    // return or toast an error message to the user
    console.error("Error initializing payroll:", error);
  }
}

/// Company Admin can pass the employee address on the frontend and click the "Add Employee" button to add an employee to the payroll
export async function addEmployeeFunction(
  employeeAddress: string,
  amount: number,
) {
  let employeePubkey = new PublicKey(employeeAddress);

  try {
    const response = await program.methods
      .addEmployee(amount)
      .accountsPartial({
        employee: employeePubkey,
        authority: provider.wallet.publicKey,
      })
      .rpc();

    if (response) {
      // return or toast a success message to the user
      console.log("Employee added successfully:", response);
    } else {
      console.log("Failed to add employee: No response from contract");
    }
  } catch (error) {
    // return or toast an error message to the user
    console.error("Error adding employee:", error);
  }
}

/// HELPER FUNCTIONS
