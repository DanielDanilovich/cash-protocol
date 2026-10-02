"""Binance connector."""
import hashlib
import hmac
import time
from typing import Dict
from .base import BaseExchange


class BinanceConnector(BaseExchange):
    def _get_base_url(self) -> str:
        return "https://testnet.binance.vision" if self.testnet else "https://api.binance.com"

    def _sign(self, params: Dict) -> str:
        query = "&".join(f"{k}={v}" for k, v in sorted(params.items()))
        sig = hmac.new(self.api_secret.encode(), query.encode(), hashlib.sha256).hexdigest()
        return query + "&signature=" + sig

    async def get_ticker(self, symbol: str) -> Dict:
        import httpx
        async with httpx.AsyncClient() as c:
            r = await c.get(self.base_url + "/api/v3/ticker/24hr", params={"symbol": symbol})
            return r.json()

    async def place_order(self, symbol: str, side: str, amount: float, price: float = None) -> Dict:
        import httpx
        p = {
            "symbol": symbol, "side": side.upper(),
            "type": "LIMIT" if price else "MARKET",
            "quantity": amount, "timestamp": int(time.time() * 1000),
        }
        if price:
            p["price"] = price
            p["timeInForce"] = "GTC"
        async with httpx.AsyncClient() as c:
            r = await c.post(self.base_url + "/api/v3/order", params=self._sign(p),
                            headers={"X-MBX-APIKEY": self.api_key})
            return r.json()

    async def get_balance(self) -> Dict[str, float]:
        import httpx
        p = {"timestamp": int(time.time() * 1000)}
        async with httpx.AsyncClient() as c:
            r = await c.get(self.base_url + "/api/v3/account", params=self._sign(p),
                           headers={"X-MBX-APIKEY": self.api_key})
            data = r.json()
            return {b["asset"]: float(b["free"]) for b in data.get("balances", [])}
