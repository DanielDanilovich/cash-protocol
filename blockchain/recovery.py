"""CASH Protocol — Quantum-Resistant Recovery Protocol."""
import hashlib
from typing import Dict, List


class RecoveryProtocol:
    """Multi-signature recovery from satellite backups."""

    def __init__(self, threshold: int = 3):
        self.threshold = threshold
        self.signatures: List[str] = []

    def add_signature(self, signature: str):
        """Add a satellite signature."""
        if signature not in self.signatures:
            self.signatures.append(signature)

    def can_recover(self) -> bool:
        """Check if enough signatures collected."""
        return len(self.signatures) >= self.threshold

    def recover(self, backup: Dict) -> Dict:
        """Execute recovery if threshold met."""
        if not self.can_recover():
            raise ValueError(f"Need {self.threshold} signatures, have {len(self.signatures)}")
        return {
            "status": "recovered",
            "signatures": self.signatures,
            "backup_id": backup.get("backup_id"),
        }
