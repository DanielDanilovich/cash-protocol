"""Curve Finance integration."""
from typing import Dict


class CurveIntegration:
    """Curve Finance stable swap integration."""

    POOLS = {
        "3pool": "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7",
        "steth": "0xDC24316b9AE028F1497c275EB9192a3Ea0f67022",
    }

    def __init__(self, pool: str = "3pool"):
        self.pool = pool
        self.pool_address = self.POOLS.get(pool)

    async def swap(self, token_in: str, token_out: str, amount: float) -> Dict:
        """Swap tokens on Curve."""
        return {
            "status": "pending",
            "token_in": token_in,
            "token_out": token_out,
            "amount": amount,
        }

    async def add_liquidity(self, amounts: list) -> Dict:
        """Add liquidity to a Curve pool."""
        return {"status": "pending", "amounts": amounts}
