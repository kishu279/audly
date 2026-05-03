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
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountIdempotent,
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

      console.log(
        "Associated Token Address:",
        associatedTokenAddress.toString(),
      );

      // Check if account exists by trying to fetch account info
      const accountInfo = await this.connection.getAccountInfo(
        new PublicKey(associatedTokenAddress.toString()),
      );

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
      const employeeAccountInfo =
        await this.connection.getAccountInfo(employeePda);
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
      const payrollAccount =
        await program.account.payrollConfig.fetch(payrollPda);
      const mintAddress = payrollAccount.mint;

      // get or create the token account of that wallet
      const [depositorTokenAddress] = await findAssociatedTokenPda({
        mint: address(mintAddress.toString()),
        owner: address(wallet.publicKey.toString()),
        tokenProgram: address(TOKEN_PROGRAM_ID.toString()),
      });

      // Check if account exists
      const accountInfo = await this.connection.getAccountInfo(
        new PublicKey(depositorTokenAddress.toString()),
      );

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
  async claimAmount(wallet: AnchorWallet, adminPubkey: string) {
    console.log("\n========== [Contract] claimAmount STARTED ==========");
    if (!wallet?.publicKey) {
      console.error("[Contract] Wallet not connected");
      return {
        success: false,
        error: "Wallet not connected",
      };
    }

    console.log("[Contract] Employee Wallet:", wallet.publicKey.toBase58());
    console.log("[Contract] Admin Pubkey:", adminPubkey);

    const program = this.getProgram(wallet);

    try {
      const adminPublicKey = new PublicKey(adminPubkey);
      console.log("[Contract] Admin Public Key:", adminPublicKey.toBase58());

      // deriving the payroll pda from the ADMIN wallet address and the "payroll" seed
      const [payrollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("payroll"), adminPublicKey.toBuffer()],
        program.programId,
      );
      console.log("[Contract] Payroll PDA:", payrollPda.toBase58());

      // deriving the employee pda from the "employee" seed, payroll pda, and employee wallet
      const [employeePda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("employee"),
          payrollPda.toBuffer(),
          wallet.publicKey.toBuffer(),
        ],
        program.programId,
      );
      console.log("[Contract] Employee PDA:", employeePda.toBase58());

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), payrollPda.toBuffer()],
        program.programId,
      );
      console.log("[Contract] Vault PDA:", vaultPda.toBase58());

      // mint address from the payroll pda
      console.log("[Contract] Fetching payroll config for mint address...");
      const mintAddress = await program.account.payrollConfig
        .fetch(payrollPda)
        .then((payroll) => payroll.mint);
      console.log("[Contract] Mint Address:", mintAddress.toString());

      // Check if employee token account exists, create if not
      console.log("[Contract] Checking if employee token account exists...");
      const employeeTokenAccountPubkey = getAssociatedTokenAddressSync(
        mintAddress,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID,
      );
      console.log(
        "[Contract] Employee Token Account Address:",
        employeeTokenAccountPubkey.toString(),
      );

      const accountInfo = await this.connection.getAccountInfo(
        employeeTokenAccountPubkey,
      );

      if (!accountInfo) {
        console.log("[Contract] ⚠️ Employee token account does NOT exist.");
        console.log(
          "[Contract] Creating it as part of the claim transaction...",
        );
        // We'll add the create instruction to the claim transaction
      } else {
        console.log("[Contract] ✅ Employee token account already exists");
      }

      // Check vault token account
      console.log("[Contract] Checking vault token account...");
      const vaultTokenAccountPubkey = getAssociatedTokenAddressSync(
        mintAddress,
        vaultPda,
        true, // allowOwnerOffCurve = true for PDA
        TOKEN_PROGRAM_ID,
      );
      console.log(
        "[Contract] Vault Token Account:",
        vaultTokenAccountPubkey.toString(),
      );

      const vaultTokenInfo = await this.connection.getAccountInfo(
        vaultTokenAccountPubkey,
      );
      if (!vaultTokenInfo) {
        console.error("[Contract] ❌ Vault token account does not exist!");
        throw new Error(
          "Vault token account not initialized. Admin must deposit funds first.",
        );
      }
      console.log("[Contract] ✅ Vault token account exists");

      // Get vault token balance
      try {
        const vaultBalance = await this.connection.getTokenAccountBalance(
          vaultTokenAccountPubkey,
        );
        console.log(
          "[Contract] Vault Token Balance:",
          vaultBalance.value.uiAmount,
          vaultBalance.value.uiAmountString,
        );
        console.log(
          "[Contract] Vault Token Balance (raw):",
          vaultBalance.value.amount,
        );
      } catch (balanceError) {
        console.error(
          "[Contract] Could not fetch vault balance:",
          balanceError,
        );
      }

      console.log("[Contract] Preparing claim instruction with accounts:");
      console.log("  - payroll:", payrollPda.toBase58());
      console.log("  - employee:", employeePda.toBase58());
      console.log("  - vault:", vaultPda.toBase58());
      console.log(
        "  - employeeTokenAccount:",
        employeeTokenAccountPubkey.toString(),
      );
      console.log("  - wallet:", wallet.publicKey.toBase58());

      console.log("[Contract] Sending claim transaction...");

      // Build the transaction
      const claimTx = program.methods.claim().accountsPartial({
        payroll: payrollPda,
        employee: employeePda,
        vault: vaultPda,
        employeeTokenAccount: employeeTokenAccountPubkey,
        wallet: wallet.publicKey,
      });

      // If token account doesn't exist, add create instruction
      if (!accountInfo) {
        console.log(
          "[Contract] Adding create ATA instruction to transaction...",
        );
        const createAtaIx = createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          employeeTokenAccountPubkey,
          wallet.publicKey,
          mintAddress,
          TOKEN_PROGRAM_ID,
        );
        claimTx.preInstructions([createAtaIx]);
      }

      const response = await claimTx.rpc();

      console.log("[Contract] ✅ Claim transaction successful!");
      console.log("[Contract] Transaction signature:", response);
      console.log("========== [Contract] claimAmount COMPLETED ==========\n");

      return {
        success: true,
        message: "Amount claimed successfully",
        data: { response },
      };
    } catch (error) {
      console.error("[Contract] ❌ claimAmount FAILED:", error);
      console.error(
        "[Contract] Error details:",
        error instanceof Error ? error.message : error,
      );
      console.log("========== [Contract] claimAmount FAILED ==========\n");
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /// Company details
  async getCompanyDetails(wallet: AnchorWallet, adminPubkey: string) {
    console.log("\n[Contract] getCompanyDetails called");
    const program = this.getProgram(wallet);
    try {
      const adminPublicKey = new PublicKey(adminPubkey);
      console.log("[Contract] Admin Public Key:", adminPublicKey.toBase58());

      // deriving the payroll pda from the admin wallet address and the "payroll" seed
      const [payrollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("payroll"), adminPublicKey.toBuffer()],
        program.programId,
      );
      console.log("[Contract] Payroll PDA:", payrollPda.toBase58());

      console.log("[Contract] Fetching payroll account...");
      const payrollAccount =
        await program.account.payrollConfig.fetch(payrollPda);

      console.log("[Contract] Payroll Account Data:", {
        totalAmount: payrollAccount.totalAmount.toString(),
        frequency: payrollAccount.frequency,
        mint: payrollAccount.mint.toString(),
        authority: payrollAccount.authority.toString(),
        started: payrollAccount.startTime.toString(),
      });

      return {
        success: true,
        data: {
          totalAmount: payrollAccount.totalAmount.toString(),
          frequency: payrollAccount.frequency,
          mint: payrollAccount.mint.toString(),
        },
      };
    } catch (error) {
      console.error("[Contract] getCompanyDetails error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /// Employee details
  async getEmployeeDetails(wallet: AnchorWallet, adminPubkey: string) {
    console.log("\n[Contract] getEmployeeDetails called");
    const program = this.getProgram(wallet);
    try {
      const adminPublicKey = new PublicKey(adminPubkey);
      console.log("[Contract] Admin Public Key:", adminPublicKey.toBase58());
      console.log("[Contract] Employee Wallet:", wallet.publicKey.toBase58());

      // deriving the payroll pda from the admin wallet address and the "payroll" seed
      const [payrollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("payroll"), adminPublicKey.toBuffer()],
        program.programId,
      );
      console.log("[Contract] Payroll PDA:", payrollPda.toBase58());

      // deriving the employee pda from the "employee" seed, payroll pda, and employee wallet
      const [employeePda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("employee"),
          payrollPda.toBuffer(),
          wallet.publicKey.toBuffer(),
        ],
        program.programId,
      );
      console.log("[Contract] Employee PDA:", employeePda.toBase58());

      console.log("[Contract] Fetching employee account...");
      const employeeAccount =
        await program.account.employeeRecord.fetch(employeePda);

      console.log("[Contract] Employee Account Data:", {
        wallet: employeeAccount.wallet.toString(),
        amount: employeeAccount.amount.toString(),
        claimed: employeeAccount.claimed.toString(),
        lastClaimTime: employeeAccount.lastClaimTime.toString(),
        lastClaimTimeDate: new Date(
          employeeAccount.lastClaimTime.toNumber() * 1000,
        ).toLocaleString(),
      });

      return {
        success: true,
        data: {
          amount: employeeAccount.amount.toString(),
          claimed: employeeAccount.claimed.toString(),
          lastClaimed: new Date(
            employeeAccount.lastClaimTime.toNumber() * 1000,
          ).toLocaleString(),
        },
      };
    } catch (error) {
      console.error("[Contract] getEmployeeDetails error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // Eligible to claim or not
  async checkClaimEligibility(wallet: AnchorWallet, adminPubkey: string) {
    console.log("\n[Contract] checkClaimEligibility called");
    const program = this.getProgram(wallet);
    try {
      const adminPublicKey = new PublicKey(adminPubkey);
      console.log("[Contract] Admin Public Key:", adminPublicKey.toBase58());
      console.log("[Contract] Employee Wallet:", wallet.publicKey.toBase58());

      // deriving the payroll pda from the admin wallet address and the "payroll" seed
      const [payrollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("payroll"), adminPublicKey.toBuffer()],
        program.programId,
      );
      console.log("[Contract] Payroll PDA:", payrollPda.toBase58());

      // deriving the employee pda from the "employee" seed, payroll pda, and employee wallet
      const [employeePda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("employee"),
          payrollPda.toBuffer(),
          wallet.publicKey.toBuffer(),
        ],
        program.programId,
      );
      console.log("[Contract] Employee PDA:", employeePda.toBase58());

      console.log("[Contract] Fetching employee and payroll accounts...");
      const employeeAccount =
        await program.account.employeeRecord.fetch(employeePda);
      const payrollAccount =
        await program.account.payrollConfig.fetch(payrollPda);

      const currentTime = Math.floor(Date.now() / 1000);
      const startTime = payrollAccount.startTime.toNumber();
      const frequency = payrollAccount.frequency;
      const freqSecs = "weekly" in frequency ? 7 * 86400 : 30 * 86400;
      const periodsPassed = Math.floor((currentTime - startTime) / freqSecs);
      const vested = periodsPassed * employeeAccount.amount.toNumber();
      const claimable = vested - employeeAccount.claimed.toNumber();
      const eligible = claimable > 0;

      console.log("[Contract] Eligibility Check Data:", {
        currentTime,
        currentTimeDate: new Date(currentTime * 1000).toLocaleString(),
        startTime,
        startTimeDate: new Date(startTime * 1000).toLocaleString(),
        frequency,
        freqSecs,
        periodsPassed,
        vested,
        claimed: employeeAccount.claimed.toNumber(),
        claimable,
        eligible,
      });

      const nextClaimTime = startTime + (periodsPassed + 1) * freqSecs;
      console.log(
        "[Contract] Next Claim Time:",
        nextClaimTime,
        "(",
        new Date(nextClaimTime * 1000).toLocaleString(),
        ")",
      );

      return {
        success: true,
        data: {
          eligible,
          nextClaimDate: new Date(nextClaimTime * 1000).toLocaleString(),
        },
      };
    } catch (error) {
      console.error("[Contract] checkClaimEligibility error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // Debug function to log all blockchain state for admin
  async debugAdminState(wallet: AnchorWallet) {
    console.log("\n========== [DEBUG] ADMIN BLOCKCHAIN STATE ==========");
    if (!wallet?.publicKey) {
      console.error("[DEBUG] Wallet not connected");
      return { success: false, error: "Wallet not connected" };
    }

    const program = this.getProgram(wallet);
    console.log("[DEBUG] Admin Wallet:", wallet.publicKey.toBase58());
    console.log("[DEBUG] Program ID:", program.programId.toBase58());

    try {
      // Derive payroll PDA
      const [payrollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("payroll"), wallet.publicKey.toBuffer()],
        program.programId,
      );
      console.log("\n[DEBUG] Payroll PDA:", payrollPda.toBase58());

      // Fetch payroll config
      const payrollAccount =
        await program.account.payrollConfig.fetch(payrollPda);
      console.log("\n[DEBUG] ===== PAYROLL CONFIG =====");
      console.log("  Authority:", payrollAccount.authority.toBase58());
      console.log("  Mint:", payrollAccount.mint.toBase58());
      console.log("  Total Amount:", payrollAccount.totalAmount.toString());
      console.log("  Frequency:", payrollAccount.frequency);
      const startTime =
        typeof payrollAccount.startTime === "number"
          ? payrollAccount.startTime
          : payrollAccount.startTime.toNumber();
      console.log("  Start Time (timestamp):", startTime);
      console.log(
        "  Start Time (date):",
        startTime === 0
          ? "Not started"
          : new Date(startTime * 1000).toLocaleString(),
      );
      console.log(
        "  Employee Count:",
        typeof payrollAccount.employeeCount === "number"
          ? payrollAccount.employeeCount
          : payrollAccount.employeeCount.toString(),
      );

      // Derive vault PDA
      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), payrollPda.toBuffer()],
        program.programId,
      );
      console.log("\n[DEBUG] Vault PDA:", vaultPda.toBase58());

      const vaultTokenAccount = await this.connection.getAccountInfo(vaultPda);

      console.log("\n[DEBUG] Checking vault token account...", {
        vaultTokenAccount,
      });

      if (vaultTokenAccount) {
        console.log("\n[DEBUG] ===== VAULT DETAILS =====");
        console.log("  Account Exists: YES");
        try {
          const balance =
            await this.connection.getTokenAccountBalance(vaultPda);

          console.log("  Balance (UI):", balance.value.uiAmount);
          console.log("  Balance (Raw):", balance.value.amount);
          console.log("  Decimals:", balance.value.decimals);
        } catch (e) {
          console.error("  Could not fetch balance:", e);
        }
      } else {
        console.log("\n[DEBUG] ===== VAULT DETAILS =====");
        console.log("  Account Exists: NO");
      }

      // Fetch all employees
      console.log("\n[DEBUG] ===== EMPLOYEES =====");
      const employeeCount =
        typeof payrollAccount.employeeCount === "number"
          ? payrollAccount.employeeCount
          : payrollAccount.employeeCount.toNumber();
      console.log("  Total Employees:", employeeCount);

      if (employeeCount > 0) {
        console.log("\n  Fetching employee accounts...");
        const employees = await program.account.employeeRecord.all([
          {
            memcmp: {
              offset: 8,
              bytes: payrollPda.toBase58(),
            },
          },
        ]);

        employees.forEach((emp, idx) => {
          console.log(`\n  [Employee ${idx + 1}]`);
          console.log("    PDA:", emp.publicKey.toBase58());
          console.log("    Wallet:", emp.account.wallet.toBase58());
          console.log("    Amount:", emp.account.amount.toString());
          console.log("    Claimed:", emp.account.claimed.toString());
          console.log(
            "    Last Claim Time:",
            emp.account.lastClaimTime.toString(),
          );
          console.log(
            "    Last Claim Date:",
            new Date(
              emp.account.lastClaimTime.toNumber() * 1000,
            ).toLocaleString(),
          );
        });
      } else {
        console.log("  No employees added yet");
      }

      console.log("\n========== [DEBUG] STATE LOGGING COMPLETE ==========\n");
      return { success: true };
    } catch (error) {
      console.error("\n[DEBUG] Error fetching state:", error);
      console.log("========== [DEBUG] STATE LOGGING FAILED ==========\n");
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
/// HELPER FUNCTIONS

export const contractInteraction = new ContractInteraction();
