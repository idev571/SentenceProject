package com.worldofwords.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun LanguageScreen(onLanguageSelected: (String) -> Unit) {
    Column(
        modifier = Modifier.fillMaxSize().padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Text(
            text = "World of Words",
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold,
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "Tilni tanlang / Выберите язык / Choose language",
            fontSize = 14.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        Spacer(modifier = Modifier.height(48.dp))

        LanguageButton(flag = "\uD83C\uDDFA\uD83C\uDDFF", label = "O'zbekcha") { onLanguageSelected("uz") }
        Spacer(modifier = Modifier.height(16.dp))
        LanguageButton(flag = "\uD83C\uDDF7\uD83C\uDDFA", label = "Русский") { onLanguageSelected("ru") }
        Spacer(modifier = Modifier.height(16.dp))
        LanguageButton(flag = "\uD83C\uDDEC\uD83C\uDDE7", label = "English") { onLanguageSelected("en") }
    }
}

@Composable
private fun LanguageButton(flag: String, label: String, onClick: () -> Unit) {
    FilledTonalButton(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth().height(56.dp),
    ) {
        Text(text = "$flag  $label", fontSize = 18.sp)
    }
}
