# Audly

### Solana-based payroll infrastructure for companies

Audly enables companies to manage their workforce payments and settle payroll directly on Solana.

Instead of manually sending payments to every worker, a company can create a payroll, assign the exact amount each worker should receive, fund the payroll, and execute the payments as a batch.

## The Problem

Companies with multiple employees or contractors often need to:

* Manage different payment amounts for different workers
* Track who should be paid and how much
* Process recurring payroll
* Verify whether payments were completed
* Keep a clear payment history

Manual wallet transfers make this process difficult to manage and audit.

## The Solution

Audly turns workforce payments into a structured payroll workflow:

```text
Company
   ↓
Add Workers
   ↓
Set Compensation
   ↓
Create Payroll
   ↓
Review & Approve
   ↓
Fund Treasury
   ↓
Execute Payments
   ↓
Workers Receive Payment
```

All payment settlement happens on **Solana**.

## Example

A company has five workers:

| Worker | Role              |  Payment |
| ------ | ----------------- | -------: |
| Rahul  | Backend Engineer  | 500 USDC |
| Aman   | Designer          | 350 USDC |
| Riya   | Product Manager   | 700 USDC |
| Arjun  | Frontend Engineer | 450 USDC |
| Neha   | QA Engineer       | 400 USDC |

Instead of manually sending five payments, the company creates one payroll run:

```text
September Payroll

5 Workers
Total: 2,400 USDC

[Review Payroll]
[Execute Payroll]
```

Audly handles the payroll execution and records the resulting Solana transactions.

## Core Features

* Company and workforce management
* Individual worker compensation
* Solana wallet management
* Payroll creation
* Batch worker payments
* Payroll approval workflow
* Treasury management
* Payment status tracking
* On-chain transaction history
* Worker payment history

## Architecture

Audly uses traditional application infrastructure for business logic and Solana for payment settlement.

```text
              Audly
                │
       ┌────────┴────────┐
       │                 │
   Application         Solana
     Layer           Settlement
       │                 │
   Workers          Treasury
   Payroll          Token Payments
   Approvals        Transactions
   History
```

Sensitive business and workforce information remains off-chain, while payment settlement and transaction records are handled through Solana.

## Who is it for?

Audly is designed for companies that pay:

* Employees
* Contractors
* Freelancers
* Remote workers
* Project-based workers

## Vision

Audly aims to make **programmable workforce payments** simple for companies by combining familiar payroll workflows with fast, transparent on-chain settlement.

> **Manage payroll off-chain. Settle payments on Solana.**
