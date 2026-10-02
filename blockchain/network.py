"""
CASH Protocol — P2P Network Layer

Handles peer discovery, message propagation, and blockchain sync.
"""
import json
import socket
import threading
import time
from typing import Dict, List, Set, Tuple, Optional
from .constants import DEFAULT_PORT, PROTOCOL_VERSION, MAX_PEERS
from .core import CashBlockchain


class CashNetwork:
    """CASH Protocol P2P Network."""

    def __init__(self, host: str = "0.0.0.0", port: int = DEFAULT_PORT):
        self.host = host
        self.port = port
        self.peers: Set[Tuple[str, int]] = set()
        self.blockchain = CashBlockchain()
        self.running = False
        self.connection_pool: Dict[str, socket.socket] = {}

    def start(self):
        """Start the P2P server."""
        self.running = True
        self._connect_bootnodes()
        threading.Thread(target=self._run_server, daemon=True).start()
        threading.Thread(target=self._sync_loop, daemon=True).start()
        print(f"[P2P] Node running on {self.host}:{self.port}")
        print(f"[P2P] Protocol: {PROTOCOL_VERSION}")

    def stop(self):
        """Stop the P2P server."""
        self.running = False
        for sock in self.connection_pool.values():
            try:
                sock.close()
            except Exception:
                pass
        self.connection_pool.clear()

    def _connect_bootnodes(self):
        """Connect to initial bootnodes."""
        bootnodes = [
            ("boot1.cash.cofc.io", DEFAULT_PORT),
            ("boot2.cash.cofc.io", DEFAULT_PORT),
            ("boot3.cash.cofc.io", DEFAULT_PORT),
        ]
        for host, port in bootnodes:
            try:
                self.peers.add((host, port))
                print(f"[P2P] Registered bootnode: {host}:{port}")
            except Exception as e:
                print(f"[P2P] Failed to register {host}: {e}")

    def _run_server(self):
        """Run the TCP server."""
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
            server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            server.bind((self.host, self.port))
            server.listen(MAX_PEERS)
            while self.running:
                try:
                    conn, addr = server.accept()
                    threading.Thread(
                        target=self._handle_peer,
                        args=(conn, addr),
                        daemon=True,
                    ).start()
                except Exception:
                    if self.running:
                        time.sleep(1)

    def _handle_peer(self, conn: socket.socket, addr: Tuple[str, int]):
        """Handle incoming peer connection."""
        try:
            conn.settimeout(30)
            data = conn.recv(65536).decode("utf-8", errors="ignore")
            if data:
                self._process_message(data, addr)
        except Exception as e:
            print(f"[P2P] Peer error from {addr}: {e}")
        finally:
            try:
                conn.close()
            except Exception:
                pass

    def _process_message(self, raw: str, addr: Tuple[str, int]):
        """Process incoming network message."""
        try:
            msg = json.loads(raw)
        except json.JSONDecodeError:
            return

        msg_type = msg.get("type")
        if msg_type == "block":
            self._handle_block(msg.get("block"))
        elif msg_type == "transaction":
            self._handle_transaction(msg.get("transaction"))
        elif msg_type == "peer_list":
            self._update_peers(msg.get("peers", []))
        elif msg_type == "ping":
            print(f"[P2P] Ping from {addr}")

    def _handle_block(self, block: Optional[Dict]):
        """Handle new block from peer."""
        if not block:
            return
        # Validate and append (simplified)
        if block.get("index") == len(self.blockchain.chain):
            self.blockchain.chain.append(block)

    def _handle_transaction(self, tx: Optional[Dict]):
        """Handle new transaction from peer."""
        if not tx:
            return
        try:
            self.blockchain.add_transaction(
                tx.get("sender", ""),
                tx.get("receiver", ""),
                float(tx.get("amount", 0)),
                tx.get("signature", ""),
                tx.get("note", ""),
            )
        except ValueError:
            pass

    def _update_peers(self, peers: List):
        """Merge peer list."""
        for peer in peers:
            try:
                self.peers.add(tuple(peer))
            except Exception:
                continue

    def _sync_loop(self):
        """Periodically sync with peers."""
        while self.running:
            time.sleep(30)
            for peer in list(self.peers):
                self._request_blocks(peer)

    def _request_blocks(self, peer: Tuple[str, int]):
        """Request blockchain from peer."""
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
                sock.settimeout(5)
                sock.connect(peer)
                request = json.dumps({"type": "get_blocks", "from": len(self.blockchain.chain)})
                sock.sendall(request.encode())
                response = sock.recv(65536).decode("utf-8", errors="ignore")
                if response:
                    data = json.loads(response)
                    for block in data.get("blocks", []):
                        self._handle_block(block)
        except Exception:
            pass

    def broadcast_transaction(self, tx: Dict):
        """Broadcast a transaction to all peers."""
        message = json.dumps({"type": "transaction", "transaction": tx})
        for peer in list(self.peers):
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
                    sock.settimeout(3)
                    sock.connect(peer)
                    sock.sendall(message.encode())
            except Exception:
                continue

    def broadcast_block(self, block: Dict):
        """Broadcast a block to all peers."""
        message = json.dumps({"type": "block", "block": block})
        for peer in list(self.peers):
            try:
                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
                    sock.settimeout(3)
                    sock.connect(peer)
                    sock.sendall(message.encode())
            except Exception:
                continue


if __name__ == "__main__":
    net = CashNetwork()
    net.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        net.stop()
