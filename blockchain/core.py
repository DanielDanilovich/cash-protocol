"""CASH Protocol — Blockchain Core."""
import hashlib
import json
import time
from typing import Dict, List, Optional
from .constants import (
    GENESIS_TIMESTAMP, TOTAL_SUPPLY, SOVEREIGN_SHARE,
    SOVEREIGN_LEDGER, SOVEREIGN_SIGNATURE, PHI, OMEGA, E_ONE, M_ZERO, H_X,
)


class HarmonicConsensus:
    def __init__(self, tolerance: float = 0.62):
        self.tolerance = tolerance

    def is_harmonic_hash(self, hash_str: str) -> bool:
        if not hash_str:
            return False
        try:
            first_hex = int(hash_str[0], 16)
            return abs(first_hex - PHI) < self.tolerance
        except (ValueError, IndexError):
            return False


class CashBlockchain:
    def __init__(self):
        self.chain = []
        self.pending_transactions = []
        self.ledger = {SOVEREIGN_LEDGER: SOVEREIGN_SHARE}
        self.consensus = HarmonicConsensus()
        self.blocks_mined = 0
        self._init_genesis_block()

    def _init_genesis_block(self):
        genesis_data = {
            "sovereign_signature": SOVEREIGN_SIGNATURE,
            "timestamp": GENESIS_TIMESTAMP,
            "transcendental_state": {
                "L0": "INFINITY", "Phi": str(PHI), "Omega": str(OMEGA),
                "E1": str(E_ONE), "M0": str(M_ZERO), "H_x": str(H_X),
            },
            "initial_distribution": {
                "total_supply": str(TOTAL_SUPPLY),
                "sovereign_ledger": SOVEREIGN_LEDGER,
                "sovereign_share": str(SOVEREIGN_SHARE),
            },
        }
        genesis_block = {
            "index": 0, "timestamp": GENESIS_TIMESTAMP, "data": genesis_data,
            "previous_hash": "0" * 64,
            "hash": self._calculate_hash(genesis_data, "0" * 64, 0, 0),
            "nonce": 0,
        }
        self.chain.append(genesis_block)

    def _calculate_hash(self, data, previous_hash, nonce, index):
        block_string = json.dumps({
            "index": index, "data": data,
            "previous_hash": previous_hash, "nonce": nonce,
        }, sort_keys=True)
        return hashlib.blake2b(block_string.encode(), digest_size=32).hexdigest()

    def add_transaction(self, sender, receiver, amount, signature="", note=""):
        if self.ledger.get(sender, 0) < amount:
            raise ValueError("Insufficient balance")
        if amount <= 0:
            raise ValueError("Amount must be positive")
        if sender == receiver:
            raise ValueError("Cannot send to self")
        txid = hashlib.sha3_256(
            (sender + receiver + str(amount) + signature + str(time.time_ns())).encode()
        ).hexdigest()[:32]
        self.ledger[sender] = self.ledger.get(sender, 0) - amount
        self.ledger[receiver] = self.ledger.get(receiver, 0) + amount
        transaction = {
            "txid": txid, "sender": sender, "receiver": receiver,
            "amount": amount, "signature": signature, "note": note,
            "timestamp": time.time(), "status": "pending",
        }
        self.pending_transactions.append(transaction)
        return txid

    def get_balance(self, address):
        return self.ledger.get(address, 0.0)

    def calculate_block_reward(self):
        epochs = self.blocks_mined // 210000
        base_reward = 50000 * (0.5 ** epochs)
        harmonic_decay = PHI / (epochs + 1)
        transcendental_factor = PHI * OMEGA * E_ONE * M_ZERO * H_X
        return (base_reward * harmonic_decay + 1.0) * transcendental_factor
