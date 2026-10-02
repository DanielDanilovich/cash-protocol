import SwiftUI

struct WalletView: View {
    @State private var address: String = "CASH_..."
    @State private var balance: Double = 0.0

    var body: some View {
        VStack(spacing: 24) {
            Text("CASH")
                .font(.system(size: 36, weight: .black, design: .serif))
                .tracking(6)

            Text("\(balance, specifier: "%.6f") CASH")
                .font(.system(size: 42, weight: .bold, design: .serif))

            Text(address)
                .font(.system(size: 11, design: .monospaced))
                .padding()
                .background(Color.gray.opacity(0.1))
                .cornerRadius(8)

            HStack(spacing: 16) {
                Button("Send") { }
                    .buttonStyle(.borderedProminent)
                Button("Receive") { }
                    .buttonStyle(.bordered)
            }
        }
        .padding()
    }
}

#Preview {
    WalletView()
}
