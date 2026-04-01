package com.worldofwords.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun WordScreen(
    language: String,
    onWordSubmitted: (String) -> Unit,
    onChangeLang: () -> Unit,
) {
    var word by remember { mutableStateOf("") }

    val labels = mapOf(
        "uz" to Triple("So'z kiriting", "So'z...", "Boshlash"),
        "ru" to Triple("Введите слово", "Слово...", "Начать"),
        "en" to Triple("Enter a word", "Word...", "Start"),
    )
    val (title, hint, button) = labels[language] ?: labels["en"]!!

    Column(
        modifier = Modifier.fillMaxSize().padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Text(text = title, fontSize = 24.sp)
        Spacer(modifier = Modifier.height(32.dp))

        OutlinedTextField(
            value = word,
            onValueChange = { word = it },
            placeholder = { Text(hint) },
            modifier = Modifier.fillMaxWidth(),
            textStyle = LocalTextStyle.current.copy(fontSize = 24.sp, textAlign = TextAlign.Center),
            singleLine = true,
        )
        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = { if (word.isNotBlank()) onWordSubmitted(word.trim()) },
            modifier = Modifier.fillMaxWidth().height(56.dp),
        ) {
            Text(text = button, fontSize = 18.sp)
        }

        Spacer(modifier = Modifier.height(16.dp))

        TextButton(onClick = onChangeLang) {
            Text("\uD83C\uDF10 ${
                mapOf("uz" to "Tilni o'zgartirish", "ru" to "Сменить язык", "en" to "Change language")[language]
            }")
        }
    }
}
