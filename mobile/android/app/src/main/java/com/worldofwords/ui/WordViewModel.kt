package com.worldofwords.ui

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.worldofwords.data.api.RetrofitClient
import com.worldofwords.data.api.WordOnlyRequest
import com.worldofwords.data.api.WordRequest
import com.worldofwords.data.model.AppState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.io.File

class WordViewModel : ViewModel() {
    private val _state = MutableStateFlow(AppState())
    val state: StateFlow<AppState> = _state.asStateFlow()

    private val api = RetrofitClient.apiService

    fun setLanguage(lang: String) {
        _state.value = _state.value.copy(language = lang)
    }

    fun setWord(word: String) {
        _state.value = _state.value.copy(
            word = word,
            audioPath = null,
            imageBytes = null,
            sentence = null,
            error = null,
        )
    }

    fun loadAudio(context: Context) {
        val word = _state.value.word ?: return
        val lang = _state.value.language ?: return

        viewModelScope.launch {
            _state.value = _state.value.copy(isAudioLoading = true, error = null)
            try {
                val response = api.getAudio(WordRequest(word, lang))
                if (response.isSuccessful) {
                    val file = File(context.cacheDir, "audio_${System.currentTimeMillis()}.mp3")
                    response.body()?.byteStream()?.use { input ->
                        file.outputStream().use { output -> input.copyTo(output) }
                    }
                    _state.value = _state.value.copy(audioPath = file.absolutePath, isAudioLoading = false)
                } else {
                    _state.value = _state.value.copy(isAudioLoading = false, error = "Audio not available")
                }
            } catch (e: Exception) {
                _state.value = _state.value.copy(isAudioLoading = false, error = e.message)
            }
        }
    }

    fun loadImage() {
        val word = _state.value.word ?: return

        viewModelScope.launch {
            _state.value = _state.value.copy(isImageLoading = true, error = null)
            try {
                val response = api.getImage(WordOnlyRequest(word))
                if (response.isSuccessful) {
                    val bytes = response.body()?.bytes()
                    _state.value = _state.value.copy(imageBytes = bytes, isImageLoading = false)
                } else {
                    _state.value = _state.value.copy(isImageLoading = false, error = "Image not available")
                }
            } catch (e: Exception) {
                _state.value = _state.value.copy(isImageLoading = false, error = e.message)
            }
        }
    }

    fun loadSentence() {
        val word = _state.value.word ?: return
        val lang = _state.value.language ?: return

        viewModelScope.launch {
            _state.value = _state.value.copy(isSentenceLoading = true, error = null)
            try {
                val response = api.getSentence(WordRequest(word, lang))
                if (response.isSuccessful) {
                    _state.value = _state.value.copy(
                        sentence = response.body()?.sentence,
                        isSentenceLoading = false,
                    )
                } else {
                    _state.value = _state.value.copy(isSentenceLoading = false, error = "Sentence not available")
                }
            } catch (e: Exception) {
                _state.value = _state.value.copy(isSentenceLoading = false, error = e.message)
            }
        }
    }

    fun reset() {
        _state.value = _state.value.copy(
            word = null,
            audioPath = null,
            imageBytes = null,
            sentence = null,
            error = null,
        )
    }
}
