package com.worldofwords.ui.screens

import android.graphics.BitmapFactory
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.worldofwords.data.model.AppState
import com.worldofwords.ui.WordViewModel

@Composable
fun ResultScreen(
    viewModel: WordViewModel,
    onNewWord: () -> Unit,
) {
    val state by viewModel.state.collectAsState()
    val context = LocalContext.current
    val lang = state.language ?: "en"

    val labels = mapOf(
        "uz" to mapOf(
            "audio" to "\uD83D\uDD0A Audio", "play" to "Tinglash",
            "makeImage" to "\uD83D\uDDBC Rasm yaratish", "makeSentence" to "\uD83D\uDCDD Gap tuzish",
            "notAvailable" to "Hozircha mavjud emas", "newWord" to "Yangi so'z",
        ),
        "ru" to mapOf(
            "audio" to "\uD83D\uDD0A Аудио", "play" to "Прослушать",
            "makeImage" to "\uD83D\uDDBC Создать картинку", "makeSentence" to "\uD83D\uDCDD Составить предложение",
            "notAvailable" to "Пока недоступно", "newWord" to "Новое слово",
        ),
        "en" to mapOf(
            "audio" to "\uD83D\uDD0A Audio", "play" to "Play",
            "makeImage" to "\uD83D\uDDBC Make image", "makeSentence" to "\uD83D\uDCDD Make a sentence",
            "notAvailable" to "Not available yet", "newWord" to "New word",
        ),
    )
    val l = labels[lang] ?: labels["en"]!!

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(text = "\"${state.word}\"", fontSize = 24.sp)
        Spacer(modifier = Modifier.height(24.dp))

        // Audio card
        Card(modifier = Modifier.fillMaxWidth()) {
            Column(
                modifier = Modifier.padding(20.dp).fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Text(l["audio"]!!, fontSize = 18.sp)
                Spacer(modifier = Modifier.height(16.dp))
                when {
                    state.isAudioLoading -> CircularProgressIndicator()
                    state.audioPath != null -> Button(onClick = { /* TODO: play audio */ }) {
                        Text(l["play"]!!)
                    }
                    else -> {
                        Text(l["notAvailable"]!!, color = MaterialTheme.colorScheme.error)
                        Spacer(modifier = Modifier.height(8.dp))
                        Button(onClick = { viewModel.loadAudio(context) }) {
                            Text("Retry")
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Image card
        Card(modifier = Modifier.fillMaxWidth()) {
            Column(
                modifier = Modifier.padding(20.dp).fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                when {
                    state.imageBytes != null -> {
                        val bitmap = BitmapFactory.decodeByteArray(state.imageBytes, 0, state.imageBytes!!.size)
                        Image(
                            bitmap = bitmap.asImageBitmap(),
                            contentDescription = state.word,
                            modifier = Modifier.fillMaxWidth().clip(RoundedCornerShape(12.dp)),
                        )
                    }
                    state.isImageLoading -> CircularProgressIndicator()
                    else -> FilledTonalButton(
                        onClick = { viewModel.loadImage() },
                        modifier = Modifier.fillMaxWidth().height(56.dp),
                    ) {
                        Text(l["makeImage"]!!, fontSize = 16.sp)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Sentence card
        Card(modifier = Modifier.fillMaxWidth()) {
            Column(
                modifier = Modifier.padding(20.dp).fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                when {
                    state.sentence != null -> Text(state.sentence!!, fontSize = 18.sp)
                    state.isSentenceLoading -> CircularProgressIndicator()
                    else -> FilledTonalButton(
                        onClick = { viewModel.loadSentence() },
                        enabled = state.imageBytes != null,
                        modifier = Modifier.fillMaxWidth().height(56.dp),
                    ) {
                        Text(l["makeSentence"]!!, fontSize = 16.sp)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // New word button
        if (state.sentence != null) {
            Button(
                onClick = {
                    viewModel.reset()
                    onNewWord()
                },
                modifier = Modifier.fillMaxWidth().height(56.dp),
            ) {
                Text(l["newWord"]!!, fontSize = 18.sp)
            }
        }
    }
}
