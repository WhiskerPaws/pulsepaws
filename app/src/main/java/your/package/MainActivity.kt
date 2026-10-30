package com.example.textutility

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme(colorScheme = darkColorScheme()) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    UtilityDashboard()
                }
            }
        }
    }
}

@Composable
fun UtilityDashboard() {
    var inputText by remember { mutableStateOf("") }
    var outputText by remember { mutableStateOf("") }
    val context = LocalContext.current

    val charCount = inputText.length
    val wordCount = if (inputText.isBlank()) 0 else inputText.trim().split("\\s+".toRegex()).size

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = "UtilityApp Engine",
            style = MaterialTheme.typography.headlineMedium,
            modifier = Modifier.padding(vertical = 8.dp)
        )
        
        Text(
            text = "Chars: $charCount | Words: $wordCount",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.secondary
        )

        // Input Box
        OutlinedTextField(
            value = inputText,
            onValueChange = { inputText = it },
            label = { Text("Input Source") },
            modifier = Modifier.fillMaxWidth().height(140.dp),
            textStyle = TextStyle(fontFamily = FontFamily.Monospace)
        )

        // Utility Buttons (Arranged neatly in linear rows for bulletproof compilation)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Button(onClick = { outputText = inputText.uppercase() }, modifier = Modifier.weight(1f)) { 
                Text("UPPER") 
            }
            Button(onClick = { outputText = inputText.lowercase() }, modifier = Modifier.weight(1f)) { 
                Text("lower") 
            }
        }

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Button(onClick = { outputText = inputText.replace("\\s+".toRegex(), " ").trim() }, modifier = Modifier.weight(1f)) { 
                Text("Clean Spaces") 
            }
            Button(onClick = { outputText = inputText.lowercase().replace("[^a-z0-9]+".toRegex(), "-").trim('-') }, modifier = Modifier.weight(1f)) { 
                Text("Slugify") 
            }
        }

        Button(
            onClick = {
                inputText = ""
                outputText = ""
            },
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
        ) {
            Text("Clear All")
        }

        // Output Box
        OutlinedTextField(
            value = outputText,
            onValueChange = {},
            readOnly = true,
            label = { Text("Processed Result") },
            modifier = Modifier.fillMaxWidth().height(140.dp),
            textStyle = TextStyle(fontFamily = FontFamily.Monospace)
        )

        Button(
            onClick = {
                if (outputText.isNotEmpty()) {
                    val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                    val clip = ClipData.newPlainText("Utility Output", outputText)
                    clipboard.setPrimaryClip(clip)
                    Toast.makeText(context, "Copied to clipboard!", Toast.LENGTH_SHORT).show()
                }
            },
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
        ) {
            Text("Copy Output Data")
        }
    }
}
