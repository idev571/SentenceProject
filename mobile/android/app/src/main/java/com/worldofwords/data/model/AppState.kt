package com.worldofwords.data.model

data class AppState(
    val language: String? = null,
    val word: String? = null,
    val audioPath: String? = null,
    val imageBytes: ByteArray? = null,
    val sentence: String? = null,
    val isAudioLoading: Boolean = false,
    val isImageLoading: Boolean = false,
    val isSentenceLoading: Boolean = false,
    val error: String? = null,
)
