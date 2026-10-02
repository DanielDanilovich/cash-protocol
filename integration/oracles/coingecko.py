"""CoinGecko oracle for crypto prices."""
from decimal import Decimal
from typing import Dict
from .base import BaseOracle


class CoinGeckoOracle(BaseOracle):
    BASE_URL = "https://api.coingecko.com/api/v3"

    async def get_rate(self, from_asset: str, to_asset: str) -> Decimal:
        import httpx
        async with httpx.AsyncClient() as c:
            r = await c.get(self.BASE_URL + "/simple/price",
                          params={"ids": from_asset.lower(), "vs_currencies": to_asset.lower()})
            data = r.json()
            return Decimal(str(data.get(from_asset.lower(), {}).get(to_asset.lower(), 0)))

    async def get_rates(self, base: str, targets: list) -> Dict[str, Decimal]:
        import httpx
        async with httpx.AsyncClient() as c:
            r = await c.get(self.BASE_URL + "/simple/price",
                          params={"ids": base.lower(),
                                  "vs_currencies": ",".join(t.lower() for t in targets)})
            data = r.json()
            return {t: Decimal(str(data.get(base.lower(), {}).get(t.lower(), 0))) for t in targets}
