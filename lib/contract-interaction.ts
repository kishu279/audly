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
  getMint,
} from "@solana/spl-token";
import { findAssociatedTokenPda } from "@solana-program/token";
import { address } from "@solana/kit";

// contract interaction
import { Auddly } from "../contract/auddly";
import idl from "../contract/auddly.json";
import { AnchorWallet } from "@solana/wallet-adapter-react";

const clusterUrl = "http://127.0.0.1:8899";

class ContractInteraction {
  private connection: Connection;

  constructor() {
    this.connection = new Connection(clusterUrl);
  }

  private async getMintDecimals(mintAddress: PublicKey): Promise<number> {
    const mintInfo = await getMint(this.connection, mintAddress);
    return mintInfo.decimals;
  }

  private toRaw(amount: number, decimals: number): BN {
    return new BN(amount * Math.pow(10, decimals));
  }

  private toUI(raw: number, decimals: number): string {
    return (raw / Math.pow(10, decimals)).toString();
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
      return { success: false, error: "Wallet not connected" };
    }

    const program = this.getProgram(wallet);
    const mintAddressPubkey = new PublicKey(mintAddress);
    const decimals = await this.getMintDecimals(mintAddressPubkey);
    const totalAmountBN = this.toRaw(totalAmount, decimals);
    const frequencyEnum =
      frequency === Frequency.Weekly ? { weekly: {} } : { monthly: {} };

    try {
      const [payrollConfigPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("payroll"), wallet.publicKey.toBuffer()],
        program.programId,
      );

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), payrollConfigPda.toBuffer()],
        program.programId,
      );

      const [associatedTokenAddress] = await findAssociatedTokenPda({
        mint: address(mintAddressPubkey.toString()),
        owner: address(wallet.publicKey.toString()),
        tokenProgram: address(TOKEN_PROGRAM_ID.toString()),
      });

      const accountInfo = await this.connection.getAccountInfo(
        new PublicKey(associatedTokenAddress.toString()),
      );

      if (!accountInfo) {
        await getOrCreateAssociatedTokenAccount(
          this.connection,
          wallet as any,
          mintAddressPubkey,
          wallet.publicKey,
        );
      }

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
      if (error.logs) console.error("Transaction logs:", error.logs);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /// Add Employee
  async addEmployeeFunction(
    wallet: AnchorWallet,
    employeeAddress: string,
    amount: number,
  ) {
    if (!wallet?.publicKey) {
      return { success: false, error: "Wallet not connected" };
    }

    const program = this.getProgram(wallet);
    const employeeWalletPubkey = new PublicKey(employeeAddress);

    if (employeeWalletPubkey.equals(wallet.publicKey)) {
      return {
        success: false,
        error: "Employee wallet cannot be the same as authority wallet",
      };
    }

    try {
      const [payrollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("payroll"), wallet.publicKey.toBuffer()],
        program.programId,
      );

      const [employeePda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("employee"),
          payrollPda.toBuffer(),
          employeeWalletPubkey.toBuffer(),
        ],
        program.programId,
      );

      const employeeAccountInfo =
        await this.connection.getAccountInfo(employeePda);
      if (employeeAccountInfo) {
        return { success: false, error: "Employee already exists in payroll" };
      }

      const payrollAccount =
        await program.account.payrollConfig.fetch(payrollPda);
      const decimals = await this.getMintDecimals(payrollAccount.mint);
      const amountBN = this.toRaw(amount, decimals);

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

  /// Start Payroll
  async startPayroll(wallet: AnchorWallet) {
    if (!wallet?.publicKey) {
      return { success: false, error: "Wallet not connected" };
    }

    const program = this.getProgram(wallet);

    try {
      const [payrollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("payroll"), wallet.publicKey.toBuffer()],
        program.programId,
      );

      const response = await program.methods
        .startPayroll()
        .accountsPartial({
          payroll: payrollPda,
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

  /// Deposit Amount
  async depositAmount(wallet: AnchorWallet, amount: number) {
    if (!wallet?.publicKey) {
      return { success: false, error: "Wallet not connected" };
    }

    const program = this.getProgram(wallet);

    try {
      const [payrollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("payroll"), wallet.publicKey.toBuffer()],
        program.programId,
      );

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), payrollPda.toBuffer()],
        program.programId,
      );

      const payrollAccount =
        await program.account.payrollConfig.fetch(payrollPda);
      const mintAddress = payrollAccount.mint;
      const decimals = await this.getMintDecimals(mintAddress);
      const amountBN = this.toRaw(amount, decimals);

      const [depositorTokenAddress] = await findAssociatedTokenPda({
        mint: address(mintAddress.toString()),
        owner: address(wallet.publicKey.toString()),
        tokenProgram: address(TOKEN_PROGRAM_ID.toString()),
      });

      const accountInfo = await this.connection.getAccountInfo(
        new PublicKey(depositorTokenAddress.toString()),
      );

      if (!accountInfo) {
        await getOrCreateAssociatedTokenAccount(
          this.connection,
          wallet as any,
          mintAddress,
          wallet.publicKey,
        );
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

  /// Claim Amount
  async claimAmount(wallet: AnchorWallet, adminPubkey: string) {
    console.log("\n========== [Contract] claimAmount STARTED ==========");
    if (!wallet?.publicKey) {
      return { success: false, error: "Wallet not connected" };
    }

    const program = this.getProgram(wallet);

    try {
      const adminPublicKey = new PublicKey(adminPubkey);

      const [payrollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("payroll"), adminPublicKey.toBuffer()],
        program.programId,
      );

      const [employeePda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("employee"),
          payrollPda.toBuffer(),
          wallet.publicKey.toBuffer(),
        ],
        program.programId,
      );

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), payrollPda.toBuffer()],
        program.programId,
      );

      const mintAddress = await program.account.payrollConfig
        .fetch(payrollPda)
        .then((p) => p.mint);

      const employeeTokenAccountPubkey = getAssociatedTokenAddressSync(
        mintAddress,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID,
      );

      const accountInfo = await this.connection.getAccountInfo(
        employeeTokenAccountPubkey,
      );

      const vaultTokenInfo = await this.connection.getAccountInfo(vaultPda);
      if (!vaultTokenInfo) {
        throw new Error(
          "Vault token account not initialized. Admin must deposit funds first.",
        );
      }

      const claimTx = program.methods.claim().accountsPartial({
        payroll: payrollPda,
        employee: employeePda,
        vault: vaultPda,
        employeeTokenAccount: employeeTokenAccountPubkey,
        wallet: wallet.publicKey,
      });

      if (!accountInfo) {
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

      console.log("[Contract] ✅ Claim transaction successful:", response);
      console.log("========== [Contract] claimAmount COMPLETED ==========\n");

      return {
        success: true,
        message: "Amount claimed successfully",
        data: { response },
      };
    } catch (error) {
      console.error("[Contract] ❌ claimAmount FAILED:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /// Company details
  async getCompanyDetails(wallet: AnchorWallet, adminPubkey: string) {
    const program = this.getProgram(wallet);
    try {
      const adminPublicKey = new PublicKey(adminPubkey);

      const [payrollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("payroll"), adminPublicKey.toBuffer()],
        program.programId,
      );

      const payrollAccount =
        await program.account.payrollConfig.fetch(payrollPda);
      const decimals = await this.getMintDecimals(payrollAccount.mint);

      return {
        success: true,
        data: {
          totalAmount: this.toUI(
            payrollAccount.totalAmount.toNumber(),
            decimals,
          ),
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
  async getEmployeeDetails(wallet: AnchorWallet, adminPubkey: string) {
    const program = this.getProgram(wallet);
    try {
      const adminPublicKey = new PublicKey(adminPubkey);

      const [payrollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("payroll"), adminPublicKey.toBuffer()],
        program.programId,
      );

      const [employeePda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("employee"),
          payrollPda.toBuffer(),
          wallet.publicKey.toBuffer(),
        ],
        program.programId,
      );

      const [employeeAccount, payrollAccount] = await Promise.all([
        program.account.employeeRecord.fetch(employeePda),
        program.account.payrollConfig.fetch(payrollPda),
      ]);

      const decimals = await this.getMintDecimals(payrollAccount.mint);

      return {
        success: true,
        data: {
          amount: this.toUI(employeeAccount.amount.toNumber(), decimals),
          claimed: this.toUI(employeeAccount.claimed.toNumber(), decimals),
          lastClaimed: new Date(
            employeeAccount.lastClaimTime.toNumber() * 1000,
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

  /// Check claim eligibility
  async checkClaimEligibility(wallet: AnchorWallet, adminPubkey: string) {
    const program = this.getProgram(wallet);
    try {
      const adminPublicKey = new PublicKey(adminPubkey);

      const [payrollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("payroll"), adminPublicKey.toBuffer()],
        program.programId,
      );

      const [employeePda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("employee"),
          payrollPda.toBuffer(),
          wallet.publicKey.toBuffer(),
        ],
        program.programId,
      );

      const [employeeAccount, payrollAccount] = await Promise.all([
        program.account.employeeRecord.fetch(employeePda),
        program.account.payrollConfig.fetch(payrollPda),
      ]);

      const decimals = await this.getMintDecimals(payrollAccount.mint);
      const currentTime = Math.floor(Date.now() / 1000);
      const startTime = payrollAccount.startTime.toNumber();
      const frequency = payrollAccount.frequency;
      const freqSecs = "weekly" in frequency ? 7 * 86400 : 60 * 5; // 2 min testing 
      // const freqSecs = "weekly" in frequency ? 7 * 86400 : 30 * 86400;
      const periodsPassed = Math.floor((currentTime - startTime) / freqSecs);
      const vested = periodsPassed * employeeAccount.amount.toNumber();
      const claimable = vested - employeeAccount.claimed.toNumber();
      const claimableUI = this.toUI(claimable, decimals);
      const eligible = claimable > 0;
      const nextClaimTime = startTime + (periodsPassed + 1) * freqSecs;

      return {
        success: true,
        data: {
          eligible,
          claimableUI,
          nextClaimDate: new Date(nextClaimTime * 1000).toLocaleString(),
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

  /// Debug admin state
  async debugAdminState(wallet: AnchorWallet) {
    console.log("\n========== [DEBUG] ADMIN BLOCKCHAIN STATE ==========");
    if (!wallet?.publicKey) {
      return { success: false, error: "Wallet not connected" };
    }

    const program = this.getProgram(wallet);
    console.log("[DEBUG] Admin Wallet:", wallet.publicKey.toBase58());
    console.log("[DEBUG] Program ID:", program.programId.toBase58());

    try {
      const [payrollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("payroll"), wallet.publicKey.toBuffer()],
        program.programId,
      );
      console.log("\n[DEBUG] Payroll PDA:", payrollPda.toBase58());

      const payrollAccount =
        await program.account.payrollConfig.fetch(payrollPda);
      const decimals = await this.getMintDecimals(payrollAccount.mint);

      console.log("\n[DEBUG] ===== PAYROLL CONFIG =====");
      console.log("  Authority:", payrollAccount.authority.toBase58());
      console.log("  Mint:", payrollAccount.mint.toBase58());
      console.log(
        "  Total Amount (UI):",
        this.toUI(payrollAccount.totalAmount.toNumber(), decimals),
      );
      console.log("  Frequency:", payrollAccount.frequency);
      const startTime =
        typeof payrollAccount.startTime === "number"
          ? payrollAccount.startTime
          : payrollAccount.startTime.toNumber();
      console.log(
        "  Start Time:",
        startTime === 0
          ? "Not started"
          : new Date(startTime * 1000).toLocaleString(),
      );
      console.log("  Employee Count:", payrollAccount.employeeCount.toString());

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), payrollPda.toBuffer()],
        program.programId,
      );
      console.log("\n[DEBUG] Vault PDA:", vaultPda.toBase58());

      const vaultTokenAccount = await this.connection.getAccountInfo(vaultPda);
      console.log("\n[DEBUG] ===== VAULT DETAILS =====");
      if (vaultTokenAccount) {
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
        console.log("  Account Exists: NO");
      }

      console.log("\n[DEBUG] ===== EMPLOYEES =====");
      const employeeCount =
        typeof payrollAccount.employeeCount === "number"
          ? payrollAccount.employeeCount
          : payrollAccount.employeeCount.toNumber();
      console.log("  Total Employees:", employeeCount);

      if (employeeCount > 0) {
        const employees = await program.account.employeeRecord.all([
          { memcmp: { offset: 8, bytes: payrollPda.toBase58() } },
        ]);

        for (const [idx, emp] of employees.entries()) {
          console.log(`\n  [Employee ${idx + 1}]`);
          console.log("    PDA:", emp.publicKey.toBase58());
          console.log("    Wallet:", emp.account.wallet.toBase58());
          console.log(
            "    Amount (UI):",
            this.toUI(emp.account.amount.toNumber(), decimals),
          );
          console.log(
            "    Claimed (UI):",
            this.toUI(emp.account.claimed.toNumber(), decimals),
          );
          console.log(
            "    Last Claim Date:",
            new Date(
              emp.account.lastClaimTime.toNumber() * 1000,
            ).toLocaleString(),
          );
        }
      } else {
        console.log("  No employees added yet");
      }

      console.log("\n========== [DEBUG] STATE LOGGING COMPLETE ==========\n");
      return { success: true };
    } catch (error) {
      console.error("\n[DEBUG] Error fetching state:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

export const contractInteraction = new ContractInteraction();
