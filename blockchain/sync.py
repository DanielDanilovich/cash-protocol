"""CASH Protocol — Blockchain synchronization utilities."""
from typing import List, Dict


class BlockSync:
    """Manages blockchain synchronization with peers."""

    @staticmethod
    def compare_chains(local: List[Dict], remote: List[Dict]) -> Dict:
        """Compare two chains and determine which is longer."""
        return {
            "local_length": len(local),
            "remote_length": len(remote),
            "longer": "remote" if len(remote) > len(local) else "local",
            "needs_sync": len(remote) > len(local),
        }

    @staticmethod
    def find_fork_point(local: List[Dict], remote: List[Dict]) -> int:
        """Find the fork point between two chains."""
        min_len = min(len(local), len(remote))
        for i in range(min_len):
            if local[i].get("hash") != remote[i].get("hash"):
                return i
        return min_len

    @staticmethod
    def blocks_to_request(local: List[Dict], remote: List[Dict]) -> List[int]:
        """Determine which block heights to request."""
        fork = BlockSync.find_fork_point(local, remote)
        return list(range(fork, len(remote)))
