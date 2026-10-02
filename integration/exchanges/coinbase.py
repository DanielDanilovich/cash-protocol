"""Coinbase connector (skeleton)."""
from typing import Dict
from .base import BaseExchange


class CoinbaseConnector(BaseExchange):
    def _get_base_url(self) -> str:
        return "https://api.exchange.coinbase.com"

    async def get_ticker(self, symbol: str) -> Dict:
        return {"symbol": symbol, "status": "skeleton"}

    async def place_order(self, symbol: str, side: str, amount: float, price: float = None) -> Dict:
        return {"status": "not_implemented"}

    async def get_balance(self) -> Dict[str, float]:
        return {}
