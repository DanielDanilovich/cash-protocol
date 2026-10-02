package io.cofc.cash.wallet

import android.os.Bundle
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(64, 128, 64, 64)
        }

        val title = TextView(this).apply {
            text = "CASH"
            textSize = 36f
        }

        val balance = TextView(this).apply {
            text = "0.000000 CASH"
            textSize = 42f
            setPadding(0, 64, 0, 64)
        }

        val address = TextView(this).apply {
            text = "CASH_..."
            textSize = 12f
        }

        layout.addView(title)
        layout.addView(balance)
        layout.addView(address)
        setContentView(layout)
    }
}
