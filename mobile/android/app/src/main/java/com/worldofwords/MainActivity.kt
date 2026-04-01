package com.worldofwords

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.lifecycle.viewmodel.compose.viewModel
import com.worldofwords.ui.WordViewModel
import com.worldofwords.ui.screens.LanguageScreen
import com.worldofwords.ui.screens.ResultScreen
import com.worldofwords.ui.screens.WordScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface {
                    val viewModel: WordViewModel = viewModel()
                    val state by viewModel.state.collectAsState()
                    var screen by remember { mutableStateOf("language") }

                    when (screen) {
                        "language" -> LanguageScreen(
                            onLanguageSelected = { lang ->
                                viewModel.setLanguage(lang)
                                screen = "word"
                            }
                        )
                        "word" -> WordScreen(
                            language = state.language ?: "en",
                            onWordSubmitted = { word ->
                                viewModel.setWord(word)
                                viewModel.loadAudio(this@MainActivity)
                                screen = "result"
                            },
                            onChangeLang = { screen = "language" },
                        )
                        "result" -> ResultScreen(
                            viewModel = viewModel,
                            onNewWord = { screen = "word" },
                        )
                    }
                }
            }
        }
    }
}
