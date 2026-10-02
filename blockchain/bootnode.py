"""CASH Protocol — Bootnode Server."""
from .network import CashNetwork
import time


class Bootnode(CashNetwork):
    """Dedicated bootnode server for peer discovery."""

    def __init__(self, host: str = "0.0.0.0", port: int = 8333):
        super().__init__(host, port)

    def start(self):
        """Start bootnode."""
        print(f"[BOOTNODE] Starting on {self.host}:{self.port}")
        super().start()
