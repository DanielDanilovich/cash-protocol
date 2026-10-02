"""Commodities oracle for gold, silver, platinum, oil."""
from decimal import Decimal
from typing import Dict
from .base import BaseOracle


class CommoditiesOracle(BaseOracle):
    REFERENCE_PRICES = {
        "GOLD": Decimal("58.00"),
        "SILVER": Decimal("0.75"),
        "PLATINUM": Decimal("28.00"),
        "OIL": Decimal("0.65"),
    }

    async def get_rate(self, from_asset: str, to_asset: str) -> Decimal:
        return self.REFERENCE_PRICES.get(from_asset.upper(), Decimal("0"))

    async def get_rates(self, base: str, targets: list) -> Dict[str, Decimal]:
        return {t: self.REFERENCE_PRICES.get(t.upper(), Decimal("0")) for t in targets}
