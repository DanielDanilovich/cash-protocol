"""Base oracle."""
from abc import ABC, abstractmethod
from decimal import Decimal
from typing import Dict


class BaseOracle(ABC):
    @abstractmethod
    async def get_rate(self, from_asset: str, to_asset: str) -> Decimal: pass
    @abstractmethod
    async def get_rates(self, base: str, targets: list) -> Dict[str, Decimal]: pass
