import { Frequency } from "./types";
import { AnchorProvider, Program, BN } from "@coral-xyz/anchor";
import {
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { findAssociatedTokenPda } from "@solana-program/token";
import { address } from "@solana/kit";

// contract interaction
import { Auddly } from "../contract/auddly";
import idl from "../contract/auddly.json";
import { AnchorWallet } from "@solana/wallet-adapter-react";

// devnet cluster URL for Solana
// const clusterUrl = "https://api.devnet.solana.com";
const clusterUrl = "http://127.0.0.1:8899";

class ContractInteraction {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(clusterUrl);
  }

  private getProgram(wallet: any): Program<Auddly> {
    const provider = new AnchorProvider(this.connection, wallet, {
      commitment: "confirmed",
    });
    return new Program<Auddly>(idl as Auddly, provider);
  }

  /// Company Admin Initializes
  async initializePayroll(
    wallet: AnchorWallet,
    totalAmount: number,
    mintAddress: string,
    frequency: Frequency,
  ) {
    if (!wallet?.publicKey) {
      return {
        success: false,
        error: "Wallet not connected",
      };
    }

    const program = this.getProgram(wallet);
    let mintAddressPubkey = new PublicKey(mintAddress);
    let totalAmountBN = new BN(totalAmount);

    // Convert frequency to Anchor enum format
    const frequencyEnum =
      frequency === Frequency.Weekly ? { weekly: {} } : { monthly: {} };

    try {
      // Derive payroll_config PDA
      const [payrollConfigPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("payroll"), wallet.publicKey.toBuffer()],
        program.programId,
      );

      // Derive vault PDA
      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), payrollConfigPda.toBuffer()],
        program.programId,
      );

      // Check and create associated token account if needed
      const [associatedTokenAddress] = await findAssociatedTokenPda({
        mint: address(mintAddressPubkey.toString()),
        owner: address(wallet.publicKey.toString()),
        tokenProgram: address(TOKEN_PROGRAM_ID.toString()),
      });

      console.log("Associated Token Address:", associatedTokenAddress.toString());

      // Check if account exists by trying to fetch account info
      const accountInfo = await this.connection.getAccountInfo(new PublicKey(associatedTokenAddress.toString()));
      
      if (!accountInfo) {
        console.log("Creating associated token account...");
        await getOrCreateAssociatedTokenAccount(
          this.connection,
          wallet as any,
          mintAddressPubkey,
          wallet.publicKey,
        );
        console.log("Associated token account created");
      }

      console.log("Program ID:", program.programId.toBase58());
      console.log("Payroll Config PDA:", payrollConfigPda.toBase58());
      console.log("Vault PDA:", vaultPda.toBase58());
      console.log("Mint:", mintAddressPubkey.toBase58());
      console.log("Authority:", wallet.publicKey.toBase58());
      console.log("Frequency:", frequencyEnum);

      const txSignature = await program.methods
        .initializePayroll(totalAmountBN, frequencyEnum)
        .accountsPartial({
          payrollConfig: payrollConfigPda,
          vault: vaultPda,
          mint: mintAddressPubkey,
          authority: wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .rpc();

      return {
        success: true,
        message: "Payroll initialized successfully",
        data: { txSignature },
      };
    } catch (error: any) {
      console.error("Full error details:", error);

      // Try to get transaction logs if available
      if (error.logs) {
        console.error("Transaction logs:", error.logs);
      }

      // Check if it's a SendTransactionError
      if (error.getLogs) {
        try {
          const logs = await error.getLogs();
          console.error("Detailed logs:", logs);
        } catch (logError) {
          console.error("Could not fetch logs:", logError);
        }
      }

      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /// Company Admin can pass the employee address on the frontend and click the "Add Employee" button to add an employee to the payroll
  async addEmployeeFunction(
    wallet: AnchorWallet,
    employeeAddress: string,
    amount: number,
  ) {
    if (!wallet?.publicKey) {
      return {
        success: false,
        error: "Wallet not connected",
      };
    }

    const program = this.getProgram(wallet);
    let employeeWalletPubkey = new PublicKey(employeeAddress);
    let amountBN = new BN(amount);

    // Check if employee wallet is same as authority
    if (employeeWalletPubkey.equals(wallet.publicKey)) {
      return {
        success: false,
        error: "Employee wallet cannot be the same as authority wallet",
      };
    }

    try {
      // deriving the payroll pda from the company admin wallet address and the "payroll" seed
      const [payrollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("payroll"), wallet.publicKey.toBuffer()],
        program.programId,
      );

      // deriving the employee pda from the "employee" seed, payroll pda, and employee wallet
      const [employeePda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("employee"),
          payrollPda.toBuffer(),
          employeeWalletPubkey.toBuffer(),
        ],
        program.programId,
      );

      // Check if employee already exists
      const employeeAccountInfo = await this.connection.getAccountInfo(employeePda);
      if (employeeAccountInfo) {
        return {
          success: false,
          error: "Employee already exists in payroll",
        };
      }

      // fetch the payroll pda
      const payrollAccount =
        await program.account.payrollConfig.fetch(payrollPda);

      // check the associated token account exist
      const [associatedTokenAddress] = await findAssociatedTokenPda({
        mint: address(payrollAccount.mint.toString()),
        owner: address(employeeWalletPubkey.toString()),
        tokenProgram: address(TOKEN_PROGRAM_ID.toString()),
      });

      console.log(
        "Associated Token Address:",
        associatedTokenAddress.toString(),
      );

      console.log("Payroll PDA:", payrollPda.toBase58());
      console.log("Employee PDA:", employeePda.toBase58());
      console.log("Employee Wallet:", employeeWalletPubkey.toBase58());
      console.log("Authority:", wallet.publicKey.toBase58());

      const txSignature = await program.methods
        .addEmployee(amountBN)
        .accountsPartial({
          payroll: payrollPda,
          employee: employeePda,
          authority: wallet.publicKey,
          wallet: employeeWalletPubkey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return {
        success: true,
        message: "Employee added successfully",
        data: { txSignature },
      };
    } catch (error) {
      console.error("Full error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /// Start Payroll - Company Admin can click the "Start Payroll" button to start the payroll and distribute the salaries to the employees based on the frequency set during initialization
  async startPayroll(wallet: AnchorWallet) {
    if (!wallet?.publicKey) {
      return {
        success: false,
        error: "Wallet not connected",
      };
    }

    const program = this.getProgram(wallet);

    try {
      // deriving the payroll pda from the company admin wallet address and the "payroll" seed
      const [parrollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("payroll"), wallet.publicKey.toBuffer()],
        program.programId,
      );

      const response = await program.methods
        .startPayroll()
        .accountsPartial({
          payroll: parrollPda,
          authority: wallet.publicKey,
        })
        .rpc();

      return {
        success: true,
        message: "Payroll started successfully",
        data: { response },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /// Deposit Amount - Company Admin can click the "Deposit Amount" button to deposit the total amount to the vault account which will be used to distribute the salaries to the employees
  async depositAmount(wallet: AnchorWallet, amount: number) {
    if (!wallet?.publicKey) {
      return {
        success: false,
        error: "Wallet not connected",
      };
    }

    const program = this.getProgram(wallet);
    let amountBN = new BN(amount);

    try {
      // deriving the payroll pda from the company admin wallet address and the "payroll" seed
      const [payrollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("payroll"), wallet.publicKey.toBuffer()],
        program.programId,
      );

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), payrollPda.toBuffer()],
        program.programId,
      );

      // mint address from the payroll pda
      const payrollAccount = await program.account.payrollConfig.fetch(payrollPda);
      const mintAddress = payrollAccount.mint;

      // get or create the token account of that wallet
      const [depositorTokenAddress] = await findAssociatedTokenPda({
        mint: address(mintAddress.toString()),
        owner: address(wallet.publicKey.toString()),
        tokenProgram: address(TOKEN_PROGRAM_ID.toString()),
      });

      // Check if account exists
      const accountInfo = await this.connection.getAccountInfo(new PublicKey(depositorTokenAddress.toString()));
      
      if (!accountInfo) {
        console.log("Creating depositor token account...");
        await getOrCreateAssociatedTokenAccount(
          this.connection,
          wallet as any,
          mintAddress,
          wallet.publicKey,
        );
        console.log("Depositor token account created");
      }

      const response = await program.methods
        .deposit(amountBN)
        .accountsPartial({
          payroll: payrollPda,
          vault: vaultPda,
          employerTokenAccount: new PublicKey(depositorTokenAddress.toString()),
          authority: wallet.publicKey,
        })
        .rpc();

      return {
        success: true,
        message: "Amount deposited successfully",
        data: { response },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /// Claim Amount - Employee can click the "Claim Amount" button to claim their salary based on the frequency set during initialization
  async claimAmount(wallet: AnchorWallet) {
    if (!wallet?.publicKey) {
      return {
        success: false,
        error: "Wallet not connected",
      };
    }

    const program = this.getProgram(wallet);

    try {
      // deriving the payroll pda from the company admin wallet address and the "payroll" seed
      const [payrollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("payroll"), wallet.publicKey.toBuffer()],
        program.programId,
      );

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), payrollPda.toBuffer()],
        program.programId,
      );

      // mint address from the payroll pda
      const mintAddress = await program.account.payrollConfig
        .fetch(payrollPda)
        .then((payroll) => payroll.mint);

      // get the token account of that wallet
      const depositorTokenAccount = await findAssociatedTokenPda({
        mint: address(mintAddress.toString()),
        owner: address(wallet.publicKey.toString()),
        tokenProgram: address(TOKEN_PROGRAM_ID.toString()),
      });

      const response = await program.methods
        .claim()
        .accountsPartial({
          payroll: payrollPda,
          employee: wallet.publicKey,
          vault: vaultPda,
          employeeTokenAccount: depositorTokenAccount[0],
          wallet: wallet.publicKey,
        })
        .rpc();

      return {
        success: true,
        message: "Amount claimed successfully",
        data: { response },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /// Company details
  async getCompanyDetails(wallet: AnchorWallet) {
    const program = this.getProgram(wallet);
    try {
      // deriving the payroll pda from the company admin wallet address and the "payroll" seed
      const [payrollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("payroll"), wallet.publicKey.toBuffer()],
        program.programId,
      );

      const payrollAccount =
        await program.account.payrollConfig.fetch(payrollPda);

      return {
        success: true,
        data: {
          totalAmount: payrollAccount.totalAmount.toString(),
          frequency: payrollAccount.frequency,
          mint: payrollAccount.mint.toString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /// Employee details
  async getEmployeeDetails(wallet: AnchorWallet) {
    const program = this.getProgram(wallet);
    try {
      // deriving the payroll pda from the company admin wallet address and the "payroll" seed
      const [payrollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("payroll"), wallet.publicKey.toBuffer()],
        program.programId,
      );

      // deriving the employee pda from the "employee" seed, payroll pda, and employee wallet
      const [employeePda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("employee"),
          payrollPda.toBuffer(),
          wallet.publicKey.toBuffer(),
        ],
        program.programId,
      );

      const employeeAccount =
        await program.account.employeeRecordw.fetch(employeePda);

      return {
        success: true,
        data: {
          amount: employeeAccount.amount.toString(),
          lastClaimed: new Date(
            employeeAccount.lastClaimed.toNumber() * 1000,
          ).toLocaleString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}
/// HELPER FUNCTIONS

export const contractInteraction = new ContractInteraction();
