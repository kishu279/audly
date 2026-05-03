/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/auddly.json`.
 */
export type Auddly = {
  "address": "CmajLsGp9XG8jh4bbxka6ApKifWsEoWNJECzK9AD91Ja",
  "metadata": {
    "name": "auddly",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addEmployee",
      "discriminator": [
        14,
        82,
        239,
        156,
        50,
        90,
        189,
        61
      ],
      "accounts": [
        {
          "name": "payroll",
          "writable": true
        },
        {
          "name": "employee",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  109,
                  112,
                  108,
                  111,
                  121,
                  101,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "payroll"
              },
              {
                "kind": "account",
                "path": "wallet"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "payroll"
          ]
        },
        {
          "name": "wallet"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claim",
      "discriminator": [
        62,
        198,
        214,
        193,
        213,
        159,
        108,
        210
      ],
      "accounts": [
        {
          "name": "payroll",
          "relations": [
            "employee"
          ]
        },
        {
          "name": "employee",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "payroll"
              }
            ]
          }
        },
        {
          "name": "employeeTokenAccount",
          "writable": true
        },
        {
          "name": "wallet",
          "signer": true,
          "relations": [
            "employee"
          ]
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "deposit",
      "discriminator": [
        242,
        35,
        198,
        137,
        82,
        225,
        242,
        182
      ],
      "accounts": [
        {
          "name": "payroll"
        },
        {
          "name": "vault",
          "writable": true,
          "relations": [
            "payroll"
          ]
        },
        {
          "name": "employerTokenAccount",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "payroll"
          ]
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializePayroll",
      "discriminator": [
        167,
        26,
        70,
        176,
        167,
        66,
        216,
        138
      ],
      "accounts": [
        {
          "name": "payrollConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  121,
                  114,
                  111,
                  108,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "payrollConfig"
              }
            ]
          }
        },
        {
          "name": "mint"
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "totalAmount",
          "type": "u64"
        },
        {
          "name": "frequency",
          "type": {
            "defined": {
              "name": "frequency"
            }
          }
        }
      ]
    },
    {
      "name": "startPayroll",
      "discriminator": [
        27,
        101,
        23,
        109,
        202,
        55,
        48,
        146
      ],
      "accounts": [
        {
          "name": "payroll",
          "writable": true
        },
        {
          "name": "vault",
          "relations": [
            "payroll"
          ]
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "payroll"
          ]
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "employeeRecord",
      "discriminator": [
        137,
        106,
        233,
        41,
        166,
        225,
        188,
        98
      ]
    },
    {
      "name": "payrollConfig",
      "discriminator": [
        126,
        142,
        7,
        211,
        33,
        33,
        103,
        211
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "Unauthorized access"
    },
    {
      "code": 6001,
      "name": "invalidMint",
      "msg": "Invalid token mint"
    },
    {
      "code": 6002,
      "name": "invalidVault",
      "msg": "Invalid vault account"
    },
    {
      "code": 6003,
      "name": "employeeAlreadyExists",
      "msg": "Employee already exists"
    },
    {
      "code": 6004,
      "name": "employeeNotFound",
      "msg": "Employee not found"
    },
    {
      "code": 6005,
      "name": "invalidEmployeeWallet",
      "msg": "Invalid employee wallet"
    },
    {
      "code": 6006,
      "name": "invalidAmount",
      "msg": "Amount must be greater than zero"
    },
    {
      "code": 6007,
      "name": "alreadyStarted",
      "msg": "Payroll already started"
    },
    {
      "code": 6008,
      "name": "notStarted",
      "msg": "Payroll not started yet"
    },
    {
      "code": 6009,
      "name": "nothingToClaim",
      "msg": "Nothing to claim"
    },
    {
      "code": 6010,
      "name": "insufficientFunds",
      "msg": "Insufficient vault balance"
    },
    {
      "code": 6011,
      "name": "mathOverflow",
      "msg": "Overflow in calculation"
    },
    {
      "code": 6012,
      "name": "invalidFrequency",
      "msg": "Invalid frequency"
    },
    {
      "code": 6013,
      "name": "tooManyEmployees",
      "msg": "Too many employees"
    }
  ],
  "types": [
    {
      "name": "employeeRecord",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "payroll",
            "type": "pubkey"
          },
          {
            "name": "wallet",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "claimed",
            "type": "u64"
          },
          {
            "name": "lastClaimTime",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "frequency",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "weekly"
          },
          {
            "name": "monthly"
          }
        ]
      }
    },
    {
      "name": "payrollConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "totalAmount",
            "type": "u64"
          },
          {
            "name": "employeeCount",
            "type": "u32"
          },
          {
            "name": "frequency",
            "type": {
              "defined": {
                "name": "frequency"
              }
            }
          },
          {
            "name": "startTime",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "employeeSeed",
      "type": "bytes",
      "value": "[101, 109, 112, 108, 111, 121, 101, 101]"
    },
    {
      "name": "mintAddress",
      "type": "pubkey",
      "value": "5VuMUWoowHHFVwvnAPiS1nRd9vmdEFaVHwoy944b3KPC"
    },
    {
      "name": "payrollSeed",
      "type": "bytes",
      "value": "[112, 97, 121, 114, 111, 108, 108]"
    },
    {
      "name": "secondsInDay",
      "type": "i64",
      "value": "86400"
    },
    {
      "name": "secondsInMonth",
      "type": "i64",
      "value": "2592000"
    },
    {
      "name": "secondsInWeek",
      "type": "i64",
      "value": "604800"
    },
    {
      "name": "vaultSeed",
      "type": "bytes",
      "value": "[118, 97, 117, 108, 116]"
    }
  ]
};
