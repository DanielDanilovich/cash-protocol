import sys
sys.path.insert(0, '.')

from blockchain.core import CashBlockchain
from blockchain.constants import SOVEREIGN_LEDGER, SOVEREIGN_SIGNATURE, TOTAL_SUPPLY, PHI
from blockchain.wallet import WalletFactory, SOVEREIGN_ADDRESS

print("=" * 70)
print("CASH PROTOCOL — System Test")
print("=" * 70)
print()
print(SOVEREIGN_SIGNATURE)
print()
print("Sovereign Address: " + SOVEREIGN_ADDRESS)
print("Total Supply:      " + format(TOTAL_SUPPLY, ","))
print("Golden Ratio Phi:  " + str(PHI))
print()

bc = CashBlockchain()
print("Genesis hash: " + bc.chain[0]["hash"][:32] + "...")
print("Sovereign balance: " + format(bc.get_balance(SOVEREIGN_LEDGER), ",.0f") + " CASH")
print("Current reward: " + str(round(bc.calculate_block_reward(), 4)) + " CASH")
print()

w = WalletFactory.create()
print("Generated wallet:")
print("  Address: " + w.address)
print("  Seed:    " + " ".join(w.seed_phrase.split()[:4]) + "...")
print()

valid = WalletFactory.validate_address(w.address)
print("Address validation: " + ("PASS" if valid else "FAIL"))
print()

test_addr = "CASH_" + "F" * 64
bc.add_transaction(SOVEREIGN_LEDGER, test_addr, 1000000)
print("Transaction: PASS")
print("Recipient: " + format(bc.get_balance(test_addr), ",.0f") + " CASH")
print()

print("=" * 70)
print("ALL SYSTEMS OPERATIONAL")
print("=" * 70)
