"""Forex oracle for fiat exchange rates."""
from decimal import Decimal
from typing import Dict
from .base import BaseOracle


class ForexOracle(BaseOracle):
    BASE_URL = "https://api.exchangerate.host"

    async def get_rate(self, from_asset: str, to_asset: str) -> Decimal:
        import httpx
        async with httpx.AsyncClient() as c:
            r = await c.get(self.BASE_URL + "/convert",
                          params={"from": from_asset.upper(), "to": to_asset.upper(), "amount": 1})
            data = r.json()
            return Decimal(str(data.get("result", 0)))

    async def get_rates(self, base: str, targets: list) -> Dict[str, Decimal]:
        import httpx
        async with httpx.AsyncClient() as c:
            r = await c.get(self.BASE_URL + "/latest", params={"base": base.upper()})
            data = r.json()
            rates = data.get("rates", {})
            return {t: Decimal(str(rates.get(t.upper(), 0))) for t in targets}
