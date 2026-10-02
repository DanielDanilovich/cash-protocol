"""CASH Protocol — REST API (FastAPI)."""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from decimal import Decimal


def create_app() -> FastAPI:
    app = FastAPI(
        title="CASH Protocol API",
        description="Sovereign, post-quantum monetary system",
        version="1.0.0",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/api/v1/health")
    async def health():
        return {"status": "ok", "version": "1.0.0"}

    @app.get("/api/v1/sovereign")
    async def sovereign():
        from blockchain.constants import SOVEREIGN_LEDGER, SOVEREIGN_SIGNATURE, TOTAL_SUPPLY
        return {
            "address": SOVEREIGN_LEDGER,
            "signature": SOVEREIGN_SIGNATURE,
            "total_supply": str(TOTAL_SUPPLY),
        }

    @app.get("/api/v1/rates/cash/eur")
    async def cash_eur():
        return {"from": "CASH", "to": "EUR", "rate": "20.00"}

    @app.get("/api/v1/rates/cash/{target}")
    async def cash_to(target: str):
        rate_eur = Decimal("20.00")
        return {"from": "CASH", "to": target.upper(), "rate_eur_pivot": str(rate_eur)}

    @app.get("/api/v1/balance/{address}")
    async def balance(address: str):
        from blockchain.wallet import WalletFactory
        if not WalletFactory.validate_address(address):
            raise HTTPException(status_code=400, detail="Invalid CASH address")
        return {"address": address, "balance": 0.0, "currency": "CASH"}

    @app.get("/api/v1/blockchain/stats")
    async def stats():
        from blockchain.core import CashBlockchain
        bc = CashBlockchain()
        return bc.to_dict()

    return app


app = create_app()
