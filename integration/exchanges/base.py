"""Base exchange connector."""
from abc import ABC, abstractmethod
from typing import Dict


class BaseExchange(ABC):
    def __init__(self, api_key: str, api_secret: str, testnet: bool = False):
        self.api_key = api_key
        self.api_secret = api_secret
        self.testnet = testnet

    @abstractmethod
    def _get_base_url(self) -> str: pass
    @abstractmethod
    async def get_ticker(self, symbol: str) -> Dict: pass
    @abstractmethod
    async def place_order(self, symbol: str, side: str, amount: float, price: float = None) -> Dict: pass
    @abstractmethod
    async def get_balance(self) -> Dict[str, float]: pass
