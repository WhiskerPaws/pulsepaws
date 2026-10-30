package com.example.textutility

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun UtilityDashboard() {
    var inputText by remember { mutableStateOf("") }
    var outputText by remember { mutableStateOf("") }
    val context = LocalContext.current

    // Inline Metrics Calculator
    val charCount = inputText.length
    val wordCount = if (inputText.isBlank()) 0 else inputText.trim().split("\\s+".toRegex()).size

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        TopAppBar(
            title = { Text("UtilityApp Engine") },
            actions = {
                Text(
                    text = "C: $charCount | W: $wordCount",
                    style = MaterialTheme.typography.bodyMedium,
                    modifier = Modifier.padding(end = 8.dp)
                )
            }
        )

        // Input Layout Window
        OutlinedTextField(
            value = inputText,
            onValueChange = { inputText = it },
            label = { Text("Input Source") },
            modifier = Modifier.fillMaxWidth().height(150.dp),
            textStyle = TextStyle(fontFamily = FontFamily.Monospace)
        )

        // Utility Grid Operations
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            modifier = Modifier.height(180.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            item { Button(onClick = { outputText = inputText.uppercase() }) { Text("UPPERCASE") } }
            item { Button(onClick = { outputText = inputText.lowercase() }) { Text("lowercase") } }
            item { Button(onClick = { outputText = inputText.replace("\\s+".toRegex(), " ").trim() }) { Text("Clean Spaces") } }
            item { 
                Button(onClick = { 
                    outputText = inputText.lowercase().replace("[^a-z0-9]+".toRegex(), "-").trim('-') 
                }) { Text("URL Slugify") } 
            }
            item {
                Button(
                    onClick = {
                        inputText = ""
                        outputText = ""
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
                ) { Text("Clear All") }
            }
        }

        // Output Window Display
        OutlinedTextField(
            value = outputText,
            onValueChange = {},
            readOnly = true,
            label = { Text("Processed Result") },
            modifier = Modifier.fillMaxWidth().height(150.dp),
            textStyle = TextStyle(fontFamily = FontFamily.Monospace)
        )

        Button(
            onClick = {
                if (outputText.isNotEmpty()) {
                    val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                    val clip = ClipData.newPlainText("Utility Output", outputText)
                    clipboard.setPrimaryClip(clip)
                    Toast.makeText(context, "Copied successfully!", Toast.LENGTH_SHORT).show()
                }
            },
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
        ) {
            Text("Copy Output Data")
        }
    }
}
